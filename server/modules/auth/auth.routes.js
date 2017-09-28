'use strict';

let express = require('express');
let router = express.Router();

let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');

module.exports = function () {

    router
        .post('/login', function (req, res) {

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

                        res.ok({user: new_user, token: token});
                    }
                    else {
                        res.ok({}, 'Usuario no encontrado.');
                    }
                }
                else {
                    res.ok({}, info.message);
                }
            })(req, res);
        });

    return router;
};