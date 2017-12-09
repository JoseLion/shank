'use strict';

let express = require('express');
let router = express.Router();

let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let BettingGroup = mongoose.model('BettingGroup');

let authHelper = require('./auth.helper');

let constants = require('../../config/constants');

module.exports = function () {

    router
        .post('/loginAdmin', function (req, res) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    res.ok({internal_error: true}, 'Al iniciar sesión.');
                    return;
                }
                let token;
                if (user) {
                    if (user.profile._id === 1 && user.status) {
                        token = user.generateJwt([]);
                        res.ok({user: user, token: token, response: ''});
                    } else {
                        res.ok({}, constants.user.disabled);
                    }
                } else {
                    res.ok({}, constants.user.notFound);
                }
            })(req, res);
        })
        .post('/login', function (req, res) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    res.ok({internal_error: true}, 'Al iniciar sesión.');
                    return;
                }
                let token;
                if (user) {
                    if (user.status) {
                        token = user.generateJwt([]);
                        res.ok({user: user, token: token, response: ''});
                    } else {
                        res.ok({}, constants.user.disabled);
                    }
                } else {
                    res.ok({}, constants.user.notFound);
                }
            })(req, res);
        })
    // .post('/login', function (req, res) {
    //     console.log('login normal');
    //     let data = req.body;
    //     passport.authenticate('local', function (err, user, info) {
    //         if (err) {
    //             res.ok({internal_error: true}, 'Al iniciar sesión.');
    //             return;
    //         }
    //         let token;
    //         if (user) {
    //             if (user.type === 1 && user.enabled) {
    //                 token = user.generateJwt([]);
    //                 let new_user = {
    //                     _id: user._id,
    //                     email: user.email,
    //                     cellPhone: user.cellPhone,
    //                     surname: user.surname,
    //                     name: user.name,
    //                     attachments: user.attachments
    //                 };
    //                 if (data.tag) {
    //                     console.log('USER: ', user);
    //                     let newGroupUser = {
    //                         userId: user._id,
    //                         score: 0,
    //                         currentRanking: 0,
    //                         currentDailyMovements: 0,
    //                         dailyMovementsDone: false,
    //                         playerRanking: [],
    //                         name: user.name,
    //                     };
    //                     BettingGroup.findOneAndUpdate({'groupToken': data.tag}, {
    //                         $push: {users: newGroupUser},
    //                     }, function (err, data) {
    //                         if (err) {
    //                             res.ok({}, 'Data not updated');
    //                         }
    //
    //                         let updateUserGroup = {
    //                             $push: {bettingGroups: data._id}
    //                         };
    //                         User.findByIdAndUpdate(new_user._id, updateUserGroup, function (err, data) {
    //                             if (err) {
    //                                 console.log("Data not updated")
    //                             } else {
    //                                 console.log("User updated")
    //                             }
    //                         });
    //                     });
    //                 }
    //                 res.ok({user: new_user, token: token, response: ''});
    //             } else {
    //                 res.ok({}, 'user not enabled.');
    //             }
    //         } else {
    //             res.ok({}, 'user not found.');
    //         }
    //     })(req, res);
    // });

    return router;
};
