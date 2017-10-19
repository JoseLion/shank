/**
 * Created by MnMistake on 9/26/2017.
 */

let mongoose = require('mongoose');
let BettingGroup = mongoose.model('BettingGroup');
let User = mongoose.model('User');

let multer = require('multer');
let ds1 = require('fs-extra');
let fs = require('fs');
let formidable = require('formidable');

let bettingGroupPhoto = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `../../uploads/betting_groups/${req.body.user}`;
        ds1.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let auth = require('../../config/auth');
/*let guard = require('../../config/guard')();*/

let prepareRouter = function (app) {

    let path = '/groups';
    let router = require('../core/routes.js')(BettingGroup, path);

    router
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
                    BettingGroup.find({'_id': {$in: user.bettingGroups}}, function (err, groupArray) {
                        if (err) {
                            console.log(err);
                            res.ok({}, 'error finding groups, try later');
                        } else {
                            console.log(groupArray);
                            res.ok({results: groupArray, err: null});
                        }
                    });
                });
        })
        .get('/allGroups', function (req, res) {
            BettingGroup
                .find()
                .select('_id name users tournament city photo prize users')
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
        .post('/createGroup', auth, function (req, res) {
            if (!req.payload._id) {
                res.ok({}, 'Usuario no autorizado.');
                return;
            }
            let data = req.body;

            let groupModel = new BettingGroup(data);
            /*
             let upload = multer({
             storage: bettingGroupPhoto
             }).single(groupModel.photo);
             upload(req, res, function(err) {
             res.end('GroupFile is uploaded')
             });
             */


            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                console.log(err)
                if (err) res.ok({}, 'error!');
                let oldpath = files.photo.path;
                let newpath = `../../public/uploads/betting_groups/${files.photo.name}`;
                fs.rename(oldpath, newpath, function (err) {
                    console.log(err)
                    if (err) {
                        res.ok({}, 'error!');
                        return;
                    }
                });
            });

            groupModel.save(function (err) {
                if (err) {
                    console.log(err)
                    res.ok({err}, 'GROUP ERROR ONM SAVE.');
                    return;
                }
                let updateUserGroup = {
                    $push: {bettingGroups: groupModel._id}
                };
                User.findByIdAndUpdate(req.payload._id, updateUserGroup, function (err, data) {
                    if (err) {
                        res.ok({}, 'Data not updated');
                    }
                    else {

                        res.ok(data);
                    }
                });
            });
        });
    return router;
};

module.exports = prepareRouter;