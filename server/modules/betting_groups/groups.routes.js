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
            BettingGroup.find(req.body)
            .populate('owner')
            .exec(function(err, groups) {
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
                                ranking: 1
                            }
                        ]
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
                bettingGroupModel.save(function(err, bettingGroupFinal) {
                    let userModel = new User(user);
                    userModel.addGroup(bettingGroupFinal._id);
                    userModel.save(function(err) {
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
            groupInformation.updateDate = new Date();
            groupInformation.activeTournaments = groupInformation.tournaments.length;
            BettingGroup.findOneAndUpdate({_id: groupInformation._id}, { $set : groupInformation}, {new: true}, function(err, group) {
                if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
                res.ok(group);
                return;
            });
        } catch(ex) {
            console.log('EX: ', ex);
            res.serverError(); return;
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
    .get(`${path}/myList/:userId`, auth, function (req, res) {
        try {
            User.findOne({_id: req.params.userId}).select('_id bettingGroups')
            .populate('bettingGroups')
            .exec(function (err, user) {
                let activeTournaments = 1;
                let groups = new Array();
                user.bettingGroups.forEach(function(group) {
                    if(group.status) {
                        let myScore = 0;
                        group.tournaments.forEach(function(tournament) {
                            if(group.activeTournaments <= 3) {
                                group.isOwner = (group.owner == user._id);
                                if(tournament.status) {
                                    tournament.users.forEach(function(userGroup) {
                                        if(userGroup._id == user._id) {
                                            tournament.myScore = userGroup.score;
                                            tournament.myRanking = userGroup.ranking;
                                            return;
                                        }
                                    });
                                    myScore += tournament.myScore;
                                }
                            }
                        });
                        group.myScore = myScore;
                        group.myRanking = 0;
                        groups.push(group);
                    }
                });
                res.ok(groups);
                return;
            });
        } catch(ex) {
            console.log('EX: ', ex);
            res.serverError(); return;
        }
    })
    .get(`${path}/group/:groupId`, auth, function(req, res) {
        try {
            BettingGroup.findById(req.params.groupId)
            .populate('users', '_id fullName photo')
            .exec(function (err, group) {
                group.tournaments.forEach(function(tournament) {
                    if(group.activeTournaments <= 3) {
                        group.isOwner = (group.owner == req.payload._id);
                        if(tournament.status) {
                            tournament.users.forEach(function(userGroup) {
                                if(userGroup._id == req.payload._id) {
                                    tournament.myScore = userGroup.score;
                                    tournament.myRanking = userGroup.ranking;
                                    return;
                                }
                            });
                        }
                    }
                });
                res.ok(group);
                return;
            })
        } catch(ex) {
            console.log('EX: ', ex);
            res.serverError(); return;
        }
    })
    .put(`${path}/addUser/:groupToken/:userId`, auth, function(req, res) {
        try {
            BettingGroup.findOne({groupToken: req.params.groupToken}).exec(function(errG, group) {
                if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
                User.findById(req.params.userId).exec(function(errU, user) {
                    if(!user) { res.ok({}, 'The user doesn\'t exist!'); return; }
                    let exists = false;
                    group.users.forEach(function(groupUser) {
                        if(groupUser._id == user._id) {
                            exists = true;
                            return;
                        }
                    });
                    if(exists) {
                        res.ok({}, 'The user is already on the group!'); return;
                    } else {
                        group.users.push(user._id);
                        group.tournaments.forEach(function(tournament) {
                            tournament.users.push({_id: user._id, fullName: user.fullName, playerRanking: []});
                        });
                        BettingGroup.findByIdAndUpdate(group._id, {$set: group}, {new: true}, function(errGU) {
                            User.findByIdAndUpdate(user._id, {$push: {bettingGroups: group._id}}, {new: true}, function(errUU) {
                                res.ok({userAdded: true});
                                return;
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
    .delete(`${path}/removeUser/:groupId/:userId`, auth, function(req, res) {
        try {
            BettingGroup.findById(req.params.groupId).exec(function(errG, group) {
                if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
                group.users = group.users.filter(function(user) {
                    return user._id != req.params.userId;
                });
                group.tournaments.forEach(function(tournament) {
                    tournament.users = tournament.users.filter(function(user) {
                        return user._id != req.params.userId;
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
    .put(`${path}/editMyPlayers/:groupId/:tournamentId`, auth, function(req, res) {
        try{
            BettingGroup.findById(req.params.groupId)
            .exec(function(err, group) {
                if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }
                group.tournaments.forEach(function(tournament) {
                    if(tournament._id == req.params.tournamentId) {
                        tournament.users.forEach(function(user) {
                            if(user._id == req.payload._id) {
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
    })


    /*
    .post('/groupInformation', auth, function(req, res) {
    if(!req.payload._id) { res.forbidden(); return; }
    BettingGroup.findOne(req.body)
    .exec(function(err, bettingGroup) {
    res.ok(bettingGroup);
    return;
});
})
.get('/myGroups', auth, function (req, res) {
if (!req.payload._id) {
res.ok({}, 'Usuario no autorizado.');
return;
}
User
.findById(req.payload._id)
.select('_id bettingGroups')
.exec(function (err, user) {
if (err) {
res.ok({}, err);
return;
}
if (user) {
BettingGroup.find({'_id': {$in: user.bettingGroups}}, function (err, groupArray) {
if (err) {
console.log(err);
res.ok({}, 'error finding groups, try later');
} else {
console.log(groupArray);
res.ok({results: groupArray, err: null});
}
});
}else{
res.status(401).send({ error: "old token, logging out" });
}
});
})
.get('/findGroupByHash', function (req, res) {
let data = req.body;
if (!data.groupToken) {
return;
}
BettingGroup
.find({'groupToken': data.groupToken})
.select('_id name users tournament city photo bet users')
.exec(function (err, user) {
if (err) {
res.ok({}, 'Al seleccionar grupos.');
return;
}
if (user) {
res.ok(user);
} else {
res.ok({}, 'Group doesnt exist');
}
});
})
.get('/allGroups', function (req, res) {
BettingGroup
.find()
.select('_id name users tournament city photo bet users groupToken')
.exec(function (err, user) {
if (err) {
res.ok({}, 'Al seleccionar grupos.');
return;
}
res.ok(user);
});
})
.get('/latestPlayerSelection', auth, function (req, res) {
if (!req.payload._id) {
res.ok({}, 'Usuario no autorizado.');
return;
}
let data = req.body;

BettingGroup.find({_id: data.groupId, 'users._id': data.userGroupId}).select('playerRanking')
.exec(function (err, playerRanking) {
if (err) {
res.ok({}, 'Al seleccionar player rankings.');
return;
}
res.ok(playerRanking);
});

})
.post('/updateUserPlayerRankingByGroup', auth, function (req, res) {
if (!req.payload._id) {
res.ok({}, 'Usuario no autorizado.');
return;
}
let data = req.body;
console.log("ghosssssssssssssssssssssssssssssstttt")
console.log(data)

BettingGroup.findOneAndUpdate({_id: data.groupId, 'users._id': data.userGroupId},
{
$set: {
'users.$.playerRanking': data.playerRankings,
}
}, {new: true, upsert: true, setDefaultsOnInsert: true},
function (err, data) {
if (err) {
console.log("okokokokokokokokokokokokokok")
console.log(err)
res.ok({}, 'Data not updated');
}
else {
res.ok(data);
}
});
});
*/    return router;
};

module.exports = prepareRouter;
