/**
 * Created by MnMistake on 9/26/2017.
 */

let mongoose = require('mongoose');
let User = mongoose.model('Group');

let multer = require('multer');
let fs = require('fs-extra');

multer.diskStorage({
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
    let router = require('../core/routes.js')(User, path);

    router
        .get('/myGroups', auth, function (req, res) {
            if (!req.payload._id) {
                res.ok({}, 'Usuario no autorizado.');
                return;
            }
            res.ok({});
          /*  User
                .findById(req.payload._id)
                .select('_id name surname email')
                .exec(function (err, user) {
                    if (err) {
                        res.ok({}, 'Al seleccionar usuario.');
                        return;
                    }
                    res.ok(user);
                });*/
        });
    return router;
};

module.exports = prepareRouter;