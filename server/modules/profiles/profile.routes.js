let mongoose = require('mongoose');
let Profile = mongoose.model('Profile');
let path = '/profiles';
let router = require('../core/routes.js')(Profile, path);

module.exports = function (app) {
    router
    .post('/findProfiles', function(req, res) {
        console.log('REQUEST: ', req.body, 'PAYLOAD: ', req.payload);
        // TODO: if is not logged
        // res.ok({}, 'Usuario no autorizado.')
        Profile.find(req.body)
        .select('id creationDate updateDate status name')
        .exec(function(err, profiles) {
            res.ok(profiles);
        });
    }).post('/saveProfile', function(req, res) {
        console.log('REQUEST: ', req.body, 'PAYLOAD: ', req.payload);
        // TODO: if is not logged
        // res.ok({}, 'Usuario no autorizado.')
        Profile.create(req.body, function(err, profile) {
            if(err) {
                console.log(err)
                res.serverError('Error!');
            } else {
                res.ok(profile);
            }
        });
    });
    return router;
};
