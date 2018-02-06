let mongoose = require('mongoose'),
multer = require('multer'),
ds1 = require('fs-extra');
fs = require('fs'),
formidable = require('formidable'),

BettingGroup = mongoose.model('BettingGroup'),
User = mongoose.model('User'),
path = '/groups',

router = require('../core/routes.js')(BettingGroup, path),
auth = require('../../config/auth'),
constants = require('../../config/constants'),
photoConfig = multer.diskStorage({
  destination: function(req, file, cb) {
    let path = `${constants.photoPath}groups/${req.payload._id}`;
    ds1.mkdirsSync(path);
    cb(null, path);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

let prepareRouter = function (app) {

  router
  .post(`${path}/list`, auth, function(req, res) {
    try {
      BettingGroup.find(req.body).populate('owner').exec(function(err, groups) {
        if(err) { res.serverError(); return; }
        res.ok(groups);
        return;
      });
    } catch(ex) {
      console.log('EX: ', ex);
      res.serverError(); return;
    }
  })
  .post(`${path}/create`, auth, multer({storage: photoConfig}).any(), function (req, res) {
    try{
      User.findById(req.payload._id).exec(function (err, user) {
        let groupInformation = JSON.parse(req.body.groupInformation);
        groupInformation.tournaments = [
          {
            tournamentId: groupInformation.tournamentId,
            tournamentName: groupInformation.tournamentName,
            users: [
              {
                _id: user._id,
                fullName: user.fullName,
                playerRanking: [],
                ranking: 0
              }
            ],
            startDate: groupInformation.tournamentStart
          }
        ];
        groupInformation.owner = user._id;
        groupInformation.users = [ user._id ];
        groupInformation.groupToken = Math.round((Math.pow(36, 21) - Math.random() * Math.pow(36, 20))).toString(36).slice(1);
        if(req.files.length > 0) {
          groupInformation.photo = {
            name: req.files[0].filename,
            path: req.files[0].path.replace(/\\/g, '/').replace(constants.photoPath, constants.docHost)
          };
        }
        let bettingGroupModel = new BettingGroup(groupInformation);
        bettingGroupModel.save(function(err2, bettingGroupFinal) {
          User.findByIdAndUpdate(user._id, { $push : { bettingGroups : bettingGroupFinal } }, { new: true}, function(err3) {
            res.ok(bettingGroupFinal);
            return;
          });
        });
      });
    } catch(ex) {
      console.log('EX: ', ex);
      res.serverError(); return;
    }
  })
  .post(`${path}/edit`, auth, multer({storage: photoConfig}).any(), function (req, res) {
    try {
      let groupInformation = JSON.parse(req.body.groupInformation);
      if(req.files.length > 0) {
        groupInformation.photo = {
          name: req.files[0].filename,
          path: req.files[0].path.replace(/\\/g, '/').replace(constants.photoPath, constants.docHost)
        };
      }

      BettingGroup.findOne({_id: groupInformation._id}).populate('users').exec((err, group) => {
          group.name = groupInformation.name;
          group.bet = groupInformation.bet;
          group.photo = groupInformation.photo;
          groupInformation.tournaments.forEach((tournament) => {
            if(tournament._id == null) {
              tournament.users = new Array();
              group.users.forEach((user) => {
                tournament.users.push({
                  _id: user._id,
                  fullName: user.fullName,
                  playerRanking: [],
                  ranking: 0
                });
              });
              group.tournaments.push(tournament);
            }
          });
          group.activeTournaments = group.tournaments.length;
          BettingGroup.findByIdAndUpdate(group._id, { $set : group}, {new: true}, function(err2, final) {
            if(!final) {
              return res.ok({}, 'The group doesn\'t exist!');
            }
            return res.ok(final);
          });
      });
    } catch(ex) {
      console.log('FATAL! ', ex);
      return res.serverError();
    }
  })
  .delete(`${path}/changeStatus/:groupId/:status`, auth, function(req, res) {
    try {
      BettingGroup.findOneAndUpdate({_id: req.params.groupId}, { $set : {status : req.params.status}}, {new: true}, function(err, group) {
        if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
        res.ok({finalStatus: group.status});
        return;
      });
    } catch(ex) {
      console.log('EX: ', ex);
      res.serverError(); return;
    }
  })
  .delete(`${path}/removeUser/:groupId/:userId`, auth, function(req, res) {
    try {
      BettingGroup.findById(req.params.groupId).exec(function(errG, group) {
        if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
        group.users = group.users.filter(function(user) {
          return !user._id.equals(req.params.userId);
        });
        group.tournaments.forEach(function(tournament) {
          tournament.users = tournament.users.filter(function(user) {
            return !user._id.equals(req.params.userId);
          });
        });
        BettingGroup.findByIdAndUpdate(group._id, {$set: group}, {new: true}, function(errGU, finalGroup) {
          User.findByIdAndUpdate(req.params.userId, {$pull: {bettingGroups: group._id}}, {new: true}, function(errUU) {
            res.ok(finalGroup);
            return;
          });
        })
      });
    } catch(ex) {
      console.log('EX: ', ex);
      res.serverError(); return;
    }
  })
  .get(`${path}/myList/:userId`, auth, function (req, res) {
    try {
      User.findOne({_id: req.params.userId}).select('_id bettingGroups').populate('bettingGroups').exec(function (err, user) {
        if(!user) {
          return res.ok({}, 'The user doesn\'t exist!');
        }

        let groups = new Array();
        user.bettingGroups.forEach((group) => {
          let tournaments = new Array();
          if(group.status) {
            group.isOwner = group.owner.equals(user._id);
            group.tournaments.forEach(function(tournament) {
              if(tournament.status) {
                tournaments.push(tournament);
              }
            });
            group.tournaments = tournaments.sort((a, b) => {
              if(a.startDate == null || b.startDate == null)
                return 0;
              return a.startDate.getTime() - b.startDate.getTime();
            });
            myTournamentData = group.tournaments[0].users.filter((ranking) => {
              return ranking._id.equals(user._id);
            })[0];
            if(myTournamentData != null) {
              group.myScore = myTournamentData.score;
              group.myRanking = myTournamentData.ranking;
            }
            group.myTournament = group.tournaments[0].tournamentName;
            groups.push(group);
          }
        });
        return res.ok(groups);
      });
    } catch(ex) {
      console.log('FATAL! ', ex);
      return res.serverError();
    }
  })
  .get(`${path}/group/:groupId`, auth, function(req, res) {
    try {
      BettingGroup.findById(req.params.groupId).populate('users', '_id fullName photo').exec((err, group) => {
        group.isOwner = group.owner.equals(req.payload._id);
        let tournaments = new Array();
        group.tournaments.forEach((tournament) => {
          if(tournament.status) {
            tournament.users.forEach((user) => {
              if(user._id.equals(req.payload._id)) {
                tournament.myScore = user.score;
                tournament.myRanking = user.ranking;
              }
            });
            tournaments.push(tournament);
          }
        });
        group.tournaments = tournaments.sort((a, b) => {
          return a.startDate.getTime() - b.startDate.getTime();
        });
        return res.ok(group);
      })
    } catch(ex) {
      console.log('FATAL! ', ex);
      return res.serverError();
    }
  })
  .put(`${path}/addUser/:groupToken/:userId`, auth, function(req, res) {
    try {
      BettingGroup.findOne({groupToken: req.params.groupToken}).exec(function(errG, group) {
        if(!group) {
          return res.ok({}, 'The group doesn\'t exist!');
        }
        User.findById(req.params.userId).exec(function(errU, user) {
          if(!user) {
            return res.ok({}, 'The user doesn\'t exist!');
          }
          let exists = false;
          group.users.forEach(function(groupUser) {
            if(groupUser == req.params.userId) {
              exists = true;
              return;
            }
          });

          if(exists) {
            return res.ok({}, 'The user is already on the group!');
          } else {
            group.users.push(req.params.userId);
            group.tournaments.forEach(function(tournament) {
              tournament.users.push({_id: req.params.userId, fullName: user.fullName, playerRanking: []});
            });
            BettingGroup.findByIdAndUpdate(group._id, {$set: group}, {new: true}, function(errGU) {
              User.findByIdAndUpdate(req.params.userId, {$push: {bettingGroups: group._id}}, {new: true}, function(errUU) {
                return res.ok({userAdded: true});
              });
            });
          }
        });
      });
    } catch(ex) {
      console.log('EX: ', ex);
      res.serverError(); return;
    }
  })
  .put(`${path}/editMyPlayers/:groupId/:tournamentId`, auth, function(req, res) {
    try{
      BettingGroup.findById(req.params.groupId)
      .exec(function(err, group) {
        if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
        group.tournaments.forEach(function(tournament) {
          if(tournament._id == req.params.tournamentId) {
            tournament.users.forEach(function(user) {
              if(user._id.equals(req.payload._id)) {
                user.playerRanking = req.body.players;
                return;
              }
            });
            return;
          }
        });
        BettingGroup.findByIdAndUpdate(req.params.groupId, {$set: group}, {new: true}, function(errGU, finalGroup) {
          res.ok(finalGroup);
          return;
        });
      });
    } catch(ex) {
      console.log('EX: ', ex);
      res.serverError(); return;
    }
  });

  return router;
};

module.exports = prepareRouter;
