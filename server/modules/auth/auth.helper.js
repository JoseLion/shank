// let express = require('express');
// let passport = require('passport');
// let mongoose = require('mongoose');
// let User = mongoose.model('User');
//
// module.exports = {
//     login: function (req, res) {
//         console.log('LOOOOGIN: ');
//         passport.authenticate('local', function (err, user, info) {
//             if (err) {
//                 res.ok({internal_error: true}, 'Al iniciar sesión.');
//                 return;
//             }
//             let token;
//             if (user) {
//                 if (user.enabled) {
//                     token = user.generateJwt([]);
//                     return ({user: user, token: token, response: ''});
//                 } else {
//                     return ({user: null, token: null, response: 'User not enabled'});
//                 }
//             } else {
//                 return ({user: null, token: null, response: 'User not found'});
//             }
//         })(req, res);
//     }
// };
