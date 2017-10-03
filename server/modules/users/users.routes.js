let mongoose = require('mongoose');
let User = mongoose.model('User');

let multer = require('multer');
let fs = require('fs-extra');
let authHelper = require('../helpers/auth.helper');
let passport = require('passport');

multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `../../uploads/admin_users/${req.body.user}`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let auth = require('../../config/auth');
let guard = require('../../config/guard')();

let prepareRouter = function (app) {

    let path = '/users';
    let router = require('../core/routes.js')(User, path);

    router
        .get('/profile', auth, function (req, res) {
            if (!req.payload._id) {
                res.ok({}, 'Usuario no autorizado.');
                return;
            }

            User
                .findById(req.payload._id)
                .select('_id name surname email')
                .exec(function (err, user) {
                    if (err) {
                        res.ok({}, 'Al seleccionar usuario.');
                        return;
                    }
                    res.ok(user);
                });
        })
        .get('/allUsers', function (req, res) {
            User
                .find()
                .select('_id name surname email hash salt enabled type')
                .exec(function (err, user) {
                    if (err) {
                        res.ok({}, 'Al seleccionar usuario.');
                        return;
                    }
                    res.ok(user);
                });
        })
        .post('/register', function (req, res) {
            let data = req.body;
            User.findOne({email: data.email})
                .select('name surname email hash salt')
                .exec(function (err, user) {
                    if (err) {
                        res.ok({err}, 'error on: searching existing user.');
                        return;
                    }
                    if (user) {
                        if (data.fbId) {
                            passport.authenticate('local', function (err, user, info) {
                                if (err) {
                                    res.ok({internal_error: true}, 'Al iniciar sesión.');
                                    return;
                                }
                                let token;
                                if (user) {
                                    if (user.type == 1 && user.enabled) {
                                        token = user.generateJwt([]);

                                        let new_user = {
                                            _id: user._id,
                                            email: user.email,
                                            cell_phone: user.cell_phone,
                                            surname: user.surname,
                                            name: user.name,
                                            attachments: user.attachments
                                        };
                                        res.ok({user: new_user, token: token, response: ''});
                                    }
                                    else {
                                        res.ok({user: null, token: null, response: 'User not enabled'});
                                    }
                                }
                                else {
                                    res.ok({user: null, token: null, response: 'User not found'});
                                }
                            })(req, res);
                        }
                        else {
                            res.ok({}, 'user already registered.');
                        }
                    } else {
                        let userModel = new User(req.body);
                        userModel.setPassword(data.password);
                        userModel.save(function (err) {
                            if (err) {
                                res.ok({err}, 'error on: saving user registration.');
                                return;
                            }
                            passport.authenticate('local', function (err, user, info) {
                                if (err) {
                                    res.ok({internal_error: true}, 'Al iniciar sesión.');
                                    return;
                                }
                                let token;
                                if (user) {
                                    if (user.type == 1 && user.enabled) {
                                        token = user.generateJwt([]);

                                        let new_user = {
                                            _id: user._id,
                                            email: user.email,
                                            cell_phone: user.cell_phone,
                                            surname: user.surname,
                                            name: user.name,
                                            attachments: user.attachments
                                        };
                                        res.ok({user: new_user, token: token, response: ''});
                                    }
                                    else {
                                        res.ok({user: null, token: null, response: 'User not enabled'});
                                    }
                                }
                                else {
                                    res.ok({user: null, token: null, response: 'User not found'});
                                }
                            })(req, res);
                        });
                        //TODO REFACTOR SINGLE LOGIN PASSPORT FUNCTION ON AUTH.ROUTE AND HERE
                        /* let response = authHelper.login(req,res);
                         console.log("response /registerss");
                         console.log(response);
                         if (response.user){
                         res.ok({user: response.user, token: response.token});
                         }else{
                         res.ok({},response.response);
                         }
                         return;*/
                    }
                });
        })
    ;
    return router;
};

module.exports = prepareRouter;