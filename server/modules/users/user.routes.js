let mongoose = require('mongoose');
let User = mongoose.model('User');

let multer = require('multer');
let fs = require('fs-extra');
//let authHelper = require('../auth/auth.helper');
let passport = require('passport');
let BettingGroup = mongoose.model('BettingGroup');

let auth = require('../../config/auth');
let guard = require('../../config/guard')();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `public/uploads/admin_users/151515`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

let prepareRouter = function (app) {

    let path = '/users';
    let router = require('../core/routes.js')(User, path);

    router
        // Administrator part:
        .post('/setUpAdminUser', function(req, res) {
            User.findOne({email: req.body.email, profile: 1})
                .exec(function(err, user) {
                    if(err) {
                        res.serverError();
                        return;
                    } else if(user.hash != null && user.salt != null) {
                        res.forbidden()
                        return;
                    }
                    let userModel = new User(user);
                    userModel.setPassword('1234');
                    userModel.save(function(err) {
                        if(err) {
                            res.serverError();
                            return
                        }
                        res.ok(userModel)
                    })
                })
        })
        .post('/findUsers', function(req, res) {
            console.log('REQUEST: ', req.body, 'PAYLOAD: ', req.payload);
            // TODO: if is not logged
            // res.ok({}, 'Usuario no autorizado.')
            User.find(req.body)
                .populate('profile')
                .exec(function(err, users) {
                    res.ok(users);
                });
        })

        // APP part:
        .post('/register', function (req, res) {
            let data = req.body;
            User.findOne({email: data.email})
                .exec(function(err, user) {
                    if (err) { res.serverError(); return; }
                    if(user) { res.ok({}, 'The email entered is already used.'); return; }

                    let userModel = new User(data);
                    userModel.setPassword(data.password);
                    userModel.save(function(err, userFinal) {
                        if(err) { res.serverError(); return; }

                        let token = userFinal.generateJwt([]);
                        res.ok({user: userFinal, token: token});
                        return;
                    });
                });


            // let data = req.body;
            // User.findOne({email: data.email})
                // .select('name surname email hash salt')
                // .exec(function (err, user) {
                //     if (err) {
                //         res.ok({err}, 'error on: searching existing user.');
                //         return;
                //     }
                //     if (user) {
                //         if (data.fbId) {
                //             passport.authenticate('local', function (err, user, info) {
                //                 if (err) {
                //                     res.ok({internal_error: true}, 'Al iniciar sesión.');
                //                     return;
                //                 }
                //                 let token;
                //                 if (user) {
                //                     if (user.type == 1 && user.enabled) {
                //                         token = user.generateJwt([]);
                //
                //                         let new_user = {
                //                             _id: user._id,
                //                             email: user.email,
                //                             cellPhone: user.cellPhone,
                //                             surname: user.surname,
                //                             name: user.name,
                //                             attachments: user.attachments
                //                         };
                //
                //                         res.ok({user: new_user, token: token, response: ''});
                //                     }
                //                     else {
                //                         res.ok({user: null, token: null, response: 'User not enabled'});
                //                     }
                //                 }
                //                 else {
                //                     res.ok({user: null, token: null, response: 'User not found'});
                //                 }
                //             })(req, res);
                //         }
                //         else {
                //             res.ok({}, 'user already registered.');
                //         }
                //     } else {
                //         let userModel = new User(req.body);
                //         userModel.setPassword(data.password);
                //         userModel.save(function (err) {
                //             if (err) {
                //                 res.ok({err}, 'error on: saving user registration.');
                //                 return;
                //             }
                //             passport.authenticate('local', function (err, user, info) {
                //                 if (err) {
                //                     res.ok({internal_error: true}, 'Al iniciar sesión.');
                //                     return;
                //                 }
                //                 let token;
                //                 if (user) {
                //                     if (user.type == 1 && user.enabled) {
                //                         token = user.generateJwt([]);
                //
                //                         let new_user = {
                //                             _id: user._id,
                //                             email: user.email,
                //                             cellPhone: user.cellPhone,
                //                             surname: user.surname,
                //                             name: user.name,
                //                             attachments: user.attachments
                //                         };
                //
                //                         if (data.tag) {
                //                             let newGroupUser = {
                //                                 userId: user._id,
                //                                 score: 0,
                //                                 currentRanking: 0,
                //                                 currentDailyMovements: 0,
                //                                 dailyMovementsDone: false,
                //                                 playerRanking: [],
                //                                 name: user.name,
                //                             };
                //                             BettingGroup.findOneAndUpdate({'groupToken': data.tag},
                //                                 {
                //                                     $push: {users: newGroupUser},
                //                                 },
                //                                 function (err, data) {
                //                                     if (err) {
                //                                         console.log("errerr findOneAndUpdate")
                //                                         console.log(err)
                //                                         res.ok({}, 'Data not updated');
                //                                     }
                //                                     console.log("datadatadata findOneAndUpdate")
                //                                     console.log(data)
                //                                     let updateUserGroup = {
                //                                         $push: {bettingGroups: data._id}
                //                                     };
                //                                     User.findByIdAndUpdate(new_user._id, updateUserGroup, function (err, data) {
                //                                         if (err) {
                //                                             console.log("Data not updated")
                //                                         }
                //                                         else {
                //                                             console.log("User updated")
                //                                         }
                //                                     });
                //                                 });
                //                         }
                //                         res.ok({user: new_user, token: token, response: ''});
                //                     }
                //                     else {
                //                         res.ok({user: null, token: null, response: 'User not enabled'});
                //                     }
                //                 }
                //                 else {
                //                     res.ok({user: null, token: null, response: 'User not found'});
                //                 }
                //             })(req, res);
                //         });
                //         //TODO REFACTOR SINGLE LOGIN PASSPORT FUNCTION ON AUTH.ROUTE AND HERE
                //         /* let response = authHelper.login(req,res);
                //          console.log("response /registerss");
                //          console.log(response);
                //          if (response.user){
                //          res.ok({user: response.user, token: response.token});
                //          }else{
                //          res.ok({},response.response);
                //          }
                //          return;*/
                //     }
                // });
        })









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
                .select('_id name surname email hash salt enabled type bettingGroups')
                .exec(function (err, user) {
                    if (err) {
                        res.ok({}, 'Al seleccionar usuarioss.');
                        return;
                    }
                    res.ok(user);
                });
        })
        .post('/updateUser', function (req, res) {
            let data = req.body;
            console.log('req')
            console.log(data)

            let upload = multer({storage: storage})
            upload.single('picture')(req, res, function (err) {
                if (err) {
                    // An error occurred when uploading
                    console.log(err)
                    res.ok({}, err.toString());
                }
                /*                console.log("data")
                 console.log(data)
                 let new_user = {
                 name:data.name,
                 photo: {
                 name: {type: String},
                 path: {type: String}
                 },
                 };*/
                res.ok({});
                // Everything went fine
            })
        })

    ;
    return router;
};

module.exports = prepareRouter;
