'use strict';

let express = require('express');
let router = express.Router();

let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let authHelper = require('../helpers/auth.helper');
let BettingGroup = mongoose.model('BettingGroup');

module.exports = function () {

    router
        .post('/login', function (req, res) {
            let data = req.body;
            /*let response = authHelper.login;
             if (response.user){
             res.ok({user: response.user, token: response.token});
             }else{
             res.ok({},response.response);
             }*/
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
                        if (data.tag) {
                            console.log("name: user.name, exportsexports")
                            console.log(user)
                            let newGroupUser = {
                                userId: user._id,
                                score: 0,
                                currentRanking: 0,
                                currentDailyMovements: 0,
                                dailyMovementsDone: false,
                                playerRanking: [],
                                name: user.name,
                            };
                            BettingGroup.findOneAndUpdate({'groupToken': data.tag},
                                {
                                    $push: {users: newGroupUser},
                                },
                                function (err, data) {
                                    if (err) {
                                        console.log("badbadbadbadbadbad findOneAndUpdate")
                                        console.log(err)
                                        res.ok({}, 'Data not updated');
                                    }
                                    console.log("datadatadata findOneAndUpdate")
                                    console.log(data)

                                    let updateUserGroup = {
                                        $push: {bettingGroups: data._id}
                                    };
                                    User.findByIdAndUpdate(new_user._id, updateUserGroup, function (err, data) {
                                        if (err) {
                                            console.log("Data not updated")
                                        }
                                        else {
                                            console.log("User updated")
                                        }
                                    });
                                });
                        }
                        res.ok({user: new_user, token: token, response: ''});
                    }
                    else {
                        res.ok({}, 'user not enabled.');
                    }
                }
                else {
                    res.ok({}, 'user not found.');
                }
            })(req, res);
        });

    return router;
};