let mongoose = require('mongoose'),
    AppSetting = mongoose.model('AppSetting'),
    path = '/app_settings';

let router = require('../core/routes.js')(AppSetting, path),
    auth = require('../../config/auth');

module.exports = function (app) {
    router
        // Commons part:
        .get(`${path}/findByCode/:code`, auth, function(req, res) {
            if(!req.payload._id) { res.forbidden(); return; }
            let data = req.params;
            AppSetting.findOne({code: data.code})
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
                AppSetting.findOne({code: data[dataSet].code})
                    .exec(function(err, setting) {
                        if(err) { res.serverError(); return; }
                        if(setting) {
                            console.log('UPDATE SETTING: ', setting)
                            let toSave = { $set : {value: data[dataSet].value} }
                            AppSetting.findByIdAndUpdate(setting._id, toSave, {new: true}, function(finalError, finalSetting) {
                                if(finalError) { res.serverError(); return; }
                                counter++;
                                if(counter === 7) { res.ok('Information saved.'); return; }
                            });
                        } else {
                            let newSetting = new AppSetting(data[dataSet]);
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
            AppSetting.findOne({code: data.code})
                .exec(function(err, setting) {
                    if(err) { res.serverError(); return; }
                    let toSave;
                    if(setting) {
                        let toSave = { $set : {value: data.value} }
                        AppSetting.findByIdAndUpdate(setting._id, toSave, {new: true}, function(finalError, finalSetting) {
                            if(finalError) { res.serverError(); return; }
                            res.ok(finalSetting);
                            return;
                        });
                    } else {
                        let newSetting = new AppSetting(data);
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
