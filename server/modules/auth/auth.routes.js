'use strict';

let express = require('express');
let router = express.Router();

let passport = require('passport');
let mongoose = require('mongoose');
let Admin_User = mongoose.model('Admin_User');
let App_User = mongoose.model('App_User');
let Permissions = require('../permissions/permissions.model.js');
  
export default function() {
  
  router
  .post('/admin_login', (req, res) => {
    
    passport.authenticate('admin-users', (err, user, info) => {
      
      // If Passport throws/catches an error
      if (err) {
        res.not_found(err);
        return;
      }
      
      if (user) {
        if (user.enabled) {
          
          Admin_User
          .findOne({_id: user._id})
          .select('_id name surname cell_phone email profile')
          .populate('profile', '_id name permissions state')
          .exec((err, res_user) => {
            if (err) {
              res.server_error();
              return;
            }
            
            Permissions.find_paths(res_user.profile.permissions).then((data) => {
              res_user = res_user.toObject();
              res_user.permissions = data;
              
              let response = {
                user: res_user,
                token: user.generateJwt(res_user.profile.permissions)
              };
              
              res.ok(response);
            })
            .catch ((err) => {
              res.server_error(err);
            });
          });
        }
        else {
          res.not_found('User disabled.');
        }
      }
      else {
        res.not_found(info.message);
      }
    })(req, res);
  });
  
  router
  .post('/app_login', (req, res) => {
    passport.authenticate('app-users', (err, user, info) => {
      // If Passport throws/catches an error
      if (err) {
        res.not_found(err);
        return;
      }
      
      if (user) {
        if (user.enabled) {
          
          App_User
          .findOne({_id: user._id})
          .select('_id fullName pushToken')
          .exec((err, res_user) => {
            if (err) {
              res.server_error();
              return;
            }
            
            let response = {
              user: res_user,
              token: user.generateJwt([])
            };
            
            res.ok(response);
          });
        }
        else {
          res.not_found('User disabled.');
        }
      }
      else {
        res.not_found(info.message);
      }
    })(req, res);
  });
  
  return router;
}