'use strict';

let mongoose = require('mongoose');
let Profile = mongoose.model('Profile');

let get_profiles = (req, res, role) => {
  try {
    Profile.find({role: role}, (err, data) => {
      if (err) {
        return res.server_error(err);
      }
      
      return res.ok(data);
    });
  }
  catch(e) {
    res.server_error();
  }
}

exports.get_admin_profiles = (req, res) => {
  get_profiles(req, res, 1);
};

exports.get_store_profiles = (req, res) => {
  get_profiles(req, res, 2);
};