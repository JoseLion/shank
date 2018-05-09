let mongoose = require('mongoose'),
    App_Setting = mongoose.model('App_Setting'),
    path = '/app_settings';

let router = require('../core/routes.js')(App_Setting, path),
    auth = require('../../config/auth');

module.exports = function (app) {
    router
        // Commons part:
        .get(`${path}/findByCode/:code`, auth, function(req, res) {
            if(!req.payload._id) { res.forbidden(); return; }
            let data = req.params;
            App_Setting.findOne({code: data.code})
                .exec(function(err, setting) {
                    if(err) { res.serverError(); return; }
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
                        if(err) { res.serverError(); return; }
                        if(setting) {
                            console.log('UPDATE SETTING: ', setting)
                            let toSave = { $set : {value: data[dataSet].value} }
                            App_Setting.findByIdAndUpdate(setting._id, toSave, {new: true}, function(finalError, finalSetting) {
                                if(finalError) { res.serverError(); return; }
                                counter++;
                                if(counter === 7) { res.ok('Information saved.'); return; }
                            });
                        } else {
                            let newSetting = new App_Setting(data[dataSet]);
                            console.log('DEFINE NEW SETTING: ', newSetting)
                            newSetting.save(function(error) {
                                if(err) { res.serverError(); return; }
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
                    if(err) { res.serverError(); return; }
                    let toSave;
                    if(setting) {
                        let toSave = { $set : {value: data.value} }
                        App_Setting.findByIdAndUpdate(setting._id, toSave, {new: true}, function(finalError, finalSetting) {
                            if(finalError) { res.serverError(); return; }
                            res.ok(finalSetting);
                            return;
                        });
                    } else {
                        let newSetting = new App_Setting(data);
                        newSetting.save(function(error) {
                            if(err) { res.serverError(); return; }
                            res.ok(newSetting);
                            return;
                        });
                    }
                });
        })
        .post('/findSettings', function(req, res) {
            console.log('REQUEST: ', req.body, 'PAYLOAD: ', req.payload);
            // TODO: if is not logged
            // res.ok({}, 'Usuario no autorizado.')
            Profile.find(req.body)
            .select('id created_at updated_at status name')
            .exec(function(err, profiles) {
                res.ok(profiles);
            });
        });
    return router;
};
