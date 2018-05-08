let express = require('express');
let router = new express.Router();
let mongoose = require('mongoose');
let Profile = mongoose.model('Profile');
let profiles_service = require('./profiles.service.js');

let profiles_router = function() {
  let path = '/profiles';
  
  router.route('/admin_profiles')
  .get(profiles_service.get_admin_profiles);
  
  router.route('/store_profiles')
  .get(profiles_service.get_store_profiles);
  
  return require('../core/routes.js')(router, Profile, path);
}

module.exports = profiles_router;