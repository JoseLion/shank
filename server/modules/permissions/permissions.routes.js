'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Admin_User = mongoose.model('Admin_User');
var Permissions = require('./permissions.model.js');

var auth = require('../../config/auth');

module.exports = () => {
  
	let app_permissions = require('./permissions.app.json');
	
  router
  .get('/app_permissions', (req, res) => {
		res.ok(app_permissions);
  })
  .get('/permissions', (req, res) => {
		res.ok(Permissions.permissions);
  })
  .get('/user_permissions', auth, (req, res) => {
		if (!req.payload._id) {
			res.ok({}, 'Usuario no autoriado.');
			return;
		}
		
		Admin_User
		.findById(req.payload._id)
		.select('_id name surname cell_phone email profile photo')
		.populate('profile', '_id name permissions state')
		.exec((err, res_user) => {
      if (err) {
        res.ok({}, 'Al seleccionar usuario.');
        return;
      }
			
			Permissions.find_paths(res_user.profile.permissions).then((data) => {
				res.ok(data);
			});
    });
  });

  return router;
};