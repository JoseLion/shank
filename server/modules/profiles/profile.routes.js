let mongoose = require('mongoose'),

Profile = mongoose.model('Profile'),
path = '/profiles',

router = require('../core/routes.js')(Profile, path),
auth = require('../../config/auth');

module.exports = function (app) {

    router.post(`${path}/findProfiles`, auth, function(req, res) {
        Profile.find(req.body)
        .exec(function(err, profiles) {
            res.ok(profiles);
        });
    })
    .post(`${path}/saveProfile`, auth, function(req, res) {
        Profile.findOne({name: req.body.name})
        .exec(function(err, profile) {
            if(err) { res.serverError(); return; }
            if(profile) { res.ok({}, `The profile "${req.body.name}" is already used.`); return; }

            let profileModel = new Profile(req.body);
            profileModel.save(function(err, profileFinal) {
                if(err) { res.serverError(); return; }
                res.ok(profileFinal);
                return;
            });
        });
    });
    return router;
};
