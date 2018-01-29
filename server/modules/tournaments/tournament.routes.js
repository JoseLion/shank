let mongoose = require('mongoose'),
Tournament = mongoose.model('Tournament'),
BettingGroup = mongoose.model('BettingGroup'),
AppSetting = mongoose.model('AppSetting'),
path = '/tournaments',
router = require('../core/routes.js')(Tournament, path),
auth = require('../../config/auth');

module.exports = (app) => {
  router
  .post(`${path}/findTournaments`, auth, (req, res) => {
    try {
      Tournament.find().populate('rounds.players.player').exec((err, tournaments) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        res.ok(tournaments);
        return;
      });
    } catch (ex) {
      console.error('FATAL! ', ex);
      res.serverError();
      return;
    }
  })
  .get(`${path}/getTournament/:tournamentId`, auth, (req, res) => {
    try {
      Tournament.findOne({ tournamentId : req.params.tournamentId }).exec((err, tournament) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        res.ok(tournament);
        return;
      });
    } catch(ex) {
      console.error('FATAL! ', ex);
      res.serverError();
      return;
    }
  })
  .post(`${path}/create`, auth, (req, res) => {
    try {
      let tournamentModel = new Tournament(req.body);
      tournamentModel.save((err, final) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        res.ok(final);
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.serverError();
      return;
    }
  })
  .post(`${path}/update`, auth, (req, res) => {
    try {
      Tournament.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true}, (err, final) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        AppSetting.find().exec((err, settings) => {
          let places = [];
          for(let i=1 ; i<=5 ; i++) {
            places.push(settings.filter(set => { return set.code == `P${i}`; })[0])
          }
          let fines = [];
          for(let i=1 ; i<=10 ; i++) {
            fines.push(settings.filter(set => { return set.code == `F${i}`; })[0])
          }
          BettingGroup.find().populate('tournaments.users').exec((err, groups) => {
            groups.forEach(group => {
              group.tournaments.forEach(tournament => {
                let tournamentDay = new Date(new Date(final.startDate).getFullYear(), new Date(final.startDate).getMonth(), new Date(final.startDate).getDate());
                tournament.users.forEach(user => {
                  if(user.score == null) {
                    user.score = 0;
                  }
                  user.playerRanking = user.playerRanking.map(ranking => {
                    let round = final.rounds.filter(round => {
                      let roundDay = new Date(new Date(round.day).getFullYear(), new Date(round.day).getMonth(), new Date(round.day).getDate());
                      return today.getTime() == roundDay.getTime() && !round.saved;
                    })[0];
                    if(round) {
                      let player = round.players.filter(p => {
                        return p.playerId == ranking.playerId && !ranking.scoreAdded;
                      })[0];
                      if(player) {
                        ranking.score = Number(places[player.position - 1].value);
                        let saveDate = new Date(new Date(ranking.daySaved).getFullYear(), new Date(ranking.daySaved).getMonth(), new Date(ranking.daySaved).getDate());
                        let diff = tournamentDay.getTime() - saveDate.getTime();
                        if(diff >= 0) {
                          ranking.score -= ranking.score * Number(fines[diff].value) / 100;
                        }
                        ranking.scoreAdded = true;
                        user.score += ranking.score;
                        user.ranking = 1;
                      }
                    }
                    return ranking;
                  });
                });
              });
              BettingGroup.findByIdAndUpdate(group._id, { $set: group }, { new: true }, (err, finalG) => { })
            });
          });
        });
        res.ok(final);
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.serverError();
      return;
    }
  });

  return router;
};
