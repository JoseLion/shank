'use strict';

let express = require('express');
let router = express.Router();

let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let authHelper = require('../helpers/auth.helper');

module.exports = function () {

    router
        .post('/login', function (req, res) {
           /* let response = authHelper.login;
            if (response.user){
                res.ok({user: response.user, token: response.token});
            }else{
                res.ok({},response.response);
            }*/
            passport.authenticate('local', function (err, user, info) {
                if (err) {
      console.log("here1")
                    res.ok({internal_error: true}, 'Al iniciar sesión.');
                    return;
                }
                let token;
                if (user) {
                    console.log("here2")
                    if (user.type == 1 && user.enabled) {
                        console.log("here3")
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
                        console.log("here4")
                        res.ok({}, 'user not enabled.');
                    }
                }
                else {
                    console.log("here5")
                    res.ok({}, 'user not found.');
                }
            })(req, res);
        });

    return router;
};