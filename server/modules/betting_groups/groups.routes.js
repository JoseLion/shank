let mongoose = require('mongoose'),
    multer = require('multer'),
    ds1 = require('fs-extra');
    fs = require('fs'),
    formidable = require('formidable'),

    BettingGroup = mongoose.model('BettingGroup'),
    User = mongoose.model('User'),
    path = '/groups',

    router = require('../core/routes.js')(BettingGroup, path),
    auth = require('../../config/auth')
    bettingGroupPhoto = multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `../../uploads/betting_groups/${req.body.user}`;
            ds1.mkdirsSync(path);
            cb(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

let prepareRouter = function (app) {

    router.post(`${path}/createGroup`, auth, function (req, res) {
        let bettingGroupModel = new BettingGroup(req.body);
        bettingGroupModel.save(function(err, bettingGroupFinal) {
            if(err) { res.serverError(); return; }
            User.findById(req.payload._id).exec(function (err, user) {
                if(err) { res.serverError(); return; }
                let userModel = new User(user);
                userModel.addGroup(bettingGroupFinal._id);
                userModel.save(function(err) {
                    if(err) { res.serverError(); return; }
                    res.ok(bettingGroupFinal);
                    return;
                });
            });
        });
        // let data = req.body;
        // let groupModel = new BettingGroup(data);
        // let form = new formidable.IncomingForm();
        // form.parse(req, function (err, fields, files) {
        //     if(err) res.serverError();
        //     let oldpath = files.photo.path;
        //     let newpath = `../../public/uploads/betting_groups/${files.photo.name}`;
        //     fs.rename(oldpath, newpath, function (err) {
        //         if(err) {
        //             res.serverError();
        //             return;
        //         }
        //     });
        // });
        // groupModel.save(function (err) {
        //     if (err) {
        //         res.ok({err}, 'GROUP ERROR ONM SAVE.');
        //         return;
        //     }
        //     let updateUserGroup = { $push: {bettingGroups: groupModel._id} };
        //     User.findByIdAndUpdate(req.payload._id, updateUserGroup, {new: true}, function (err, data) {
        //         if (err) res.ok({}, 'Data not updated');
        //         else res.ok(data);
        //     });
        // });
    })
    .post(`${path}/editGroup`, auth, function (req, res) {
        BettingGroup.findOne({_id: req.body._id}).exec(function(err, group) {
            if(err) { res.serverError(); return; }
            if(!group) { res.ok({}, 'The group doesn\'t exist!'); return; }

            let bettingGroupModel = new BettingGroup(req.body);
            bettingGroupModel.save(function(err) {
                if(err) { res.serverError(); return; }
                res.ok(bettingGroupModel);
                return;
            })
        })
        let bettingGroupModel = new BettingGroup(req.body);
        bettingGroupModel.save(function(err, bettingGroupFinal) {
            if(err) { res.serverError(); return; }
            res.ok(bettingGroupFinal);
            return;
        });
        // let data = req.body;
        // let groupModel = new BettingGroup(data);
        // let form = new formidable.IncomingForm();
        // form.parse(req, function (err, fields, files) {
        //     if(err) res.serverError();
        //     let oldpath = files.photo.path;
        //     let newpath = `../../public/uploads/betting_groups/${files.photo.name}`;
        //     fs.rename(oldpath, newpath, function (err) {
        //         if(err) {
        //             res.serverError();
        //             return;
        //         }
        //     });
        // });
        // groupModel.save(function (err) {
        //     if (err) {
        //         res.ok({err}, 'GROUP ERROR ONM SAVE.');
        //         return;
        //     }
        //     let updateUserGroup = { $push: {bettingGroups: groupModel._id} };
        //     User.findByIdAndUpdate(req.payload._id, updateUserGroup, {new: true}, function (err, data) {
        //         if (err) res.ok({}, 'Data not updated');
        //         else res.ok(data);
        //     });
        // });
    })
    .get(`${path}/myList/:userId`, auth, function (req, res) {
        console.log('PAYLOAD: ', req.payload);
        User.findOne({_id: req.params.userId}).select('_id bettingGroups')
        .populate('bettingGroups')
        .exec(function (err, user) {
            if(err) { res.serverError(); return; }
            console.log(user);
            if(user) {
                res.ok(user.bettingGroups);
                return;
            } else {
                res.ok([]);
                return;
            }
        });
    })





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

        /*            BettingGroup.findOneAndUpdate({id: data.groupId,'users._id': data.userGroupId}, SampleComment, {new: true, upsert: true, setDefaultsOnInsert: true}, function(error, result) {
        if(error){
        console.log("Something wrong when updating data!");
    }

    console.log(result);
});*/

/*        User.findOneAndUpdate(
{ id: data.groupId, 'users._id': data.userGroupId},
{
$push: {
'users.$.playerRanking': {  playerRanking: data.playerRankings},
}
}
)*/

/* BettingGroup.findById(data.groupId, function(err, post) {
let subDoc = post.users.id(data.userGroupId);
subDoc.push(data.playerRankings);
post.save().then(function(savedUserGroup) {
res.ok(savedUserGroup);
}).catch(function(err) {
res.ok({}, 'Data not updated');
});
});*/
})
;
return router;
};

module.exports = prepareRouter;
