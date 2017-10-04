/**
 * Created by MnMistake on 9/26/2017.
 */

let mongoose = require('mongoose');
let BettingGroup = mongoose.model('BettingGroup');
let User = mongoose.model('User');

let multer = require('multer');
let fs = require('fs-extra');

let bettingGroupPhoto = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `../../uploads/betting_groups/${req.body.user}`;
        fs.mkdirsSync(path);
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
                            res.ok({},'error finding groups, try later');
                        } else {
                            console.log(groupArray);
                            res.ok({results:groupArray,err:null});
                        }
                    });
                });
        })
        .get('/allGroups', function (req, res) {
            BettingGroup
                .find()
                .select('_id name users tournament city photo')
                .exec(function (err, user) {
                    if (err) {
                        res.ok({}, 'Al seleccionar grupos.');
                        return;
                    }
                    res.ok(user);
                });
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
            groupModel.save(function (err) {
                if (err) {
                    res.ok({err}, 'GROUP ERROR ONM SAVE.');
                    return;
                }
                let updateUserGroup = {
                    $push: { bettingGroups: groupModel._id }
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