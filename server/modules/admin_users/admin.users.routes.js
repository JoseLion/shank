let mongoose = require('mongoose');
let Admin_User = mongoose.model('Admin_User');
let mail_service = require('../services/mail.services');
let string_utils = require('../utils/string.utils');
let users_service = require('./users.service.js');
let auth = require('../../config/auth');

let router = require('../core/routes.js')(Admin_User, '/admin_users');

let prepare_router = function(app) {
  let path = '/admin_users';
  
  router.route(path)
  .post(users_service.add_admin_user)
  .get(users_service.get_admin_users);
  
  router.route('/update_admin_user/:_id')
  .put(users_service.update_admin_user);
  
  router.route('/get_data_for_create_admin_user')
  .get(users_service.get_data_for_create_admin_user);
  
  router.route('/get_data_for_update_admin_user/:_id')
  .get(users_service.get_data_for_update_admin_user);
  
  router.route('/change_password_admin_user')
  .post(auth, users_service.change_password_admin_user);
  
  router.route('/recovery_password_admin_user')
  .post((req, res) => {
    
    try {
      Admin_User
      .findOne({email: req.body.email, role: 1, enabled: true})
      .select('_id email name surname cell_phone')
      .exec((err, res_user) => {
        if (err) {
          res.not_found(err);
          return;
        }
        
        if (res_user === null) {
          res.not_found('User not found.');
          return;
        }
        
        let admin_user = new Admin_User();
        let new_pasword = string_utils.string();
        
        let email_body = {
          to: res_user.email,
          user: res_user.name + " " + res_user.surname,
          new_pasword: new_pasword
        };
        
        mail_service.send_recover_password_admin_user(app, email_body, (email_err) => {
          if (email_err) {
            return res.server_error(email_err);
          }
          
          let hashes = admin_user.getNewPassword(new_pasword);
          
          let user_to_update = {
            hash: hashes.hash,
            salt: hashes.salt
          };
          
          Admin_User.update({_id: res_user._id}, user_to_update, (err, user_updated) => {
            if (err) {
              res.server_error(err.message);
              return;
            }
            
            res.ok(email_body);
          });
        });
      });
    }
    catch(e) {
      res.server_error(e);
    }
  });
  
  return router;
}

module.exports = prepare_router;