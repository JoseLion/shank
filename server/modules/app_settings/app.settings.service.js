'use strict';

let mongoose = require('mongoose');
let App_Setting = mongoose.model('App_Setting');

let get_web_links = (req, res) => {
  try {
    App_Setting.findOne({'code': 'WLK'}, (err, data) => {
      if (err) {
        return res.server_error(err);
      }
      
      res.ok(data);
    });
  } catch(e) {
    res.server_error();
  }
};

exports.get_web_links = (req, res) => {
  get_web_links(req, res);
};