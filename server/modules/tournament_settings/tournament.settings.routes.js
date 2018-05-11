let mongoose = require('mongoose');
let App_Setting = mongoose.model('App_Setting');
let path = '/tournament_settings';

let router = require('../core/routes.js')(App_Setting, path);
let auth = require('../../config/auth');
let Q = require('q');
let tournament_settings_service = require('./tournament.settings.service.js');

module.exports = function (app) {
  router
  .get('/get_tournament_settings', auth, function(req, res) {
    tournament_settings_service.get_tournament_settings(req, res);
  })
  .post('/save_tournament_settings', auth, function(req, res) {
    let promises = [];
    
    if (req.body.points._id) {
      promises = [
        App_Setting.findByIdAndUpdate(req.body.points._id, req.body.points).exec(),
        App_Setting.findByIdAndUpdate(req.body.fines_percentage._id, req.body.fines_percentage).exec()
      ];
    }
    else {
      let points = new App_Setting(req.body.points);
      let fines_percentage = new App_Setting(req.body.fines_percentage);
      
      promises = [
        points.save(),
        fines_percentage.save()
      ];
    }
    
    Q.all(promises).then(() => {
      tournament_settings_service.get_tournament_settings(req, res);
    });
  });
  
  return router;
};
