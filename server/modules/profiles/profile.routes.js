let mongoose = require('mongoose'),
Profile = mongoose.model('Profile'),
path = '/profiles',
router = require('../core/routes.js')(Profile, path),
auth = require('../../config/auth');

module.exports = function (app) {
  router
  .post(`${path}/findProfiles`, auth, (req, res) => {
    Profile.find(req.body).exec((err, profiles) => {
      res.ok(profiles);
    });
  })
  .post(`${path}/save`, auth, function(req, res) {
    Profile.findOne({acronyms: req.body.acronyms}).exec(function(err, profile) {
      if(err) {
        res.serverError();
        return;
      }
      if(profile && profile._id != req.body._id) {
        res.ok({}, `The profile "${req.body.acronyms}" is already used.`);
        return;
      }

      Profile.findByIdAndUpdate(req.body._id, { $set : req.body }, { new: true }, (err, final) => {
        if(err) {
          res.serverError();
          return;
        }
        res.ok(final);
        return;
      });
    });
  });

  return router;
};
