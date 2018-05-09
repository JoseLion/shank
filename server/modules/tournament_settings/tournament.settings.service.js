'use strict';

let mongoose = require('mongoose');
let AppSetting = mongoose.model('AppSetting');
let Q = require('q');

let get_tournament_settings = (req, res) => {
  try {
    let promises = [
      AppSetting.findOne({'code': 'PTS'}).exec(),
      AppSetting.findOne({'code': 'FND'}).exec()
    ];
    
    Q.all(promises).spread((res_points, res_fines_percentage) => {
      res.ok({points: res_points, fines_percentage: res_fines_percentage});
    }, (err) => {
      res.server_error(err);
    });
  } catch(e) {
    res.server_error();
  }
};

exports.get_tournament_settings = (req, res) => {
  get_tournament_settings(req, res);
};