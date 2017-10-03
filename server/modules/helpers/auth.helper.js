/**
 * Created by MnMistake on 10/3/2017.
 */

let express = require('express');
let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');

module.exports ={
       login:  function (req, res) {
           console.log("req, resreq, res")
           console.log(req, res)
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
                        return ({user: new_user, token: token, response: ''});
                    }
                    else {
                        return ({user: null, token: null, response: 'User not enabled'});
                    }
                }
                else {
                    return ({user: null, token: null, response: 'User not found'});
                }
            })(req, res);
        }
};