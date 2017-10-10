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
                .select('_id name users tournament city photo prize users')
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