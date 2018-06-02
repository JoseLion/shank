let mongoose = require('mongoose'),
    App_Setting = mongoose.model('App_Setting'),
    path = '/app_settings';

let router = require('../core/routes.js')(App_Setting, path),
    auth = require('../../config/auth');
    
let app_settings_service = require('./app.settings.service.js');

module.exports = function (app) {
  router
  // Commons part:
  .get(`${path}/findByCode/:code`, auth, function(req, res) {
    if(!req.payload._id) { res.forbidden(); return; }
    let data = req.params;
    App_Setting.findOne({code: data.code})
    .exec(function(err, setting) {
      if(err) { res.server_error(); return; }
      res.ok(setting);
      return;
    });
  })
  // Administrator part:
  .post(`${path}/masiveCreateUpdate`, auth, function(req, res) {
    if(!req.payload._id) { res.forbidden(); return; }
    let data = req.body;
    let counter = 0;
    for(let dataSet in data) {
      App_Setting.findOne({code: data[dataSet].code})
      .exec(function(err, setting) {
        if(err) { res.server_error(); return; }
        if(setting) {
          console.log('UPDATE SETTING: ', setting)
          let toSave = { $set : {value: data[dataSet].value} }
          App_Setting.findByIdAndUpdate(setting._id, toSave, {new: true}, function(finalError, finalSetting) {
            if(finalError) { res.server_error(); return; }
            counter++;
            if(counter === 7) { res.ok('Information saved.'); return; }
          });
        } else {
          let newSetting = new App_Setting(data[dataSet]);
          console.log('DEFINE NEW SETTING: ', newSetting)
          newSetting.save(function(error) {
            if(err) { res.server_error(); return; }
            counter++;
            if(counter === 7) { res.ok('Information saved.'); return; }
          });
        }
      });
    }
  })
  .post(`${path}/createUpdate`, auth, function(req, res) {
    if(!req.payload._id) { res.forbidden(); return; }
    let data = req.body;
    App_Setting.findOne({code: data.code})
    .exec(function(err, setting) {
      if(err) { res.server_error(); return; }
      let toSave;
      if(setting) {
        let toSave = { $set : {value: data.value} }
        App_Setting.findByIdAndUpdate(setting._id, toSave, {new: true}, function(finalError, finalSetting) {
          if(finalError) { res.server_error(); return; }
          res.ok(finalSetting);
          return;
        });
      } else {
        let newSetting = new App_Setting(data);
        newSetting.save(function(error) {
          if(err) { res.server_error(); return; }
          res.ok(newSetting);
          return;
        });
      }
    });
  })
  .post('/findSettings', function(req, res) {
    Profile.find(req.body)
    .select('id created_at updated_at enabled name')
    .exec(function(err, profiles) {
      res.ok(profiles);
    });
  })
  .post('/get_app_settings', auth, app_settings_service.get_web_links)
  .post('/save_web_link', auth, function(req, res) {
    
    if (req.body._id) {
      App_Setting.findByIdAndUpdate(req.body._id, req.body, (err) => {
        if (err) {
          return res.server_error(err);
        }
        
        app_settings_service.get_web_links(req, res);
      });
    }
    else {
      let web_link = new App_Setting(req.body);
      
      web_link.save(function (err) {
        if (err) {
          return res.server_error(err);
        }
        
        app_settings_service.get_web_links(req, res);
      });
    }
  })
  .get('/get_weblinks', app_settings_service.get_web_links);
  
  return router;
};
