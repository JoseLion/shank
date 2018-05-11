'use strict';

let mongoose = require('mongoose');
let Admin_User = mongoose.model('Admin_User');
let Profile = mongoose.model('Profile');
let Q = require('q');

let create_user = (req, res, role) => {
  try {
    if (!req.body.password) {
      res.bad_request('password is required.');
      return;
    }
    
    let req_body = req.body;
    req_body.role = role;
    
    let user = new Admin_User(req_body);
    
    user.setPassword(req_body.password);
    
    user.save((err, user_created) => {
      if (err) {
        res.server_error(err.message);
        return;
      }
      
      Admin_User
      .findById(user_created._id)
      .select('_id name surname cell_phone email profile photo')
      .populate('profile', '_id name permissions state')
      .exec((err, res_user) => {
        if (err) {
          res.server_error(err.message);
          return;
        }
        res.ok({user: res_user, token: user.generateJwt(res_user.profile.permissions)});
      });
    });
  } catch(e) {
    res.server_error();
  }
};

let update_admin_user = (req, res) => {
  try {
    
    let user_to_update = req.body;
    
    if (user_to_update.password) {
      var user = new Admin_User();
      var hashes = user.getNewPassword(user_to_update.password);
      user_to_update.hash = hashes.hash; 
      user_to_update.salt = hashes.salt;
    }
    
    Admin_User.findByIdAndUpdate(user_to_update._id, user_to_update, function(err) {
      if (err) {
        res.server_error(err.message);
        return;
      }
      
      res.ok(user_to_update);
    });
  } catch(e) {
    res.server_error();
  }
};


let get_admin_users = (req, res) => {
  console.log('************************');
  try {
    Admin_User
    .find()
    .populate('profile', '_id name')
    .exec((err, data) => {
      if (err) {
        return res.server_error(err);
      }
      
      res.ok(data);
    });
  }
  catch(e) {
    res.server_error();
  }
};

let get_store_users = (req, res) => {
  try {
    Admin_User
    .find({role: 2})
    .populate('profile', '_id name')
    .populate({path: 'shop', select: '_id name', populate: {path: 'city', select: '_id name code'}})
    .exec((err, data) => {
      if (err) {
        return res.server_error(err);
      }
      
      return res.ok(data);
    });
  }
  catch(e) {
    res.server_error();
  }
};

let get_data_for_admin_user = (req, res, is_for_create) => {
  try {
    if (is_for_create) {
      Profile
      .find()
      .exec((err, profiles) => {
        if (err) {
          return res.server_error(err);
        }
        
        res.ok({profiles: profiles});
      });
    }
    else {
      let promises = [
        Admin_User.findById(req.params._id).exec(),
        Profile.find().exec()
      ];
      
      Q.all(promises).spread((user, profiles) => {
        res.ok({user: user, profiles: profiles});
      }, (err) => {
        res.server_error(err);
      });
    }
  }
  catch(e) {
    res.server_error();
  }
};

let change_password_admin_user = (req, res) => {
  try {
    
    if (!req.payload._id) {
      return res.unauthorized();
    }
    
    if (!req.body.current_password) {
      return res.bad_request('current password is required.');
    }
    
    if (!req.body.password) {
      return res.bad_request('password is required.');
    }
    
    Admin_User.findOne({_id: req.payload._id}, (err, res_admin_user) => {
      try {
        if (err) {
          return res.server_error(err.message);
        }
        
        if (!res_admin_user.validPassword(req.body.current_password)) {
          return res.server_error('incorrect current password.');
        }
        
        let req_body = req.body;
        
        let admin_user = new Admin_User();
        let hashes = admin_user.getNewPassword(req_body.password);
        req_body.hash = hashes.hash;
        req_body.salt = hashes.salt;
        
        Admin_User.findByIdAndUpdate(req.payload._id, req_body, (err) => {
          if (err) {
            return res.server_error(err.message);
          }
          
          res.ok(req_body);
        });
      }
      catch(e) {
        res.server_error();
      }
    });
  }
  catch(e) {
    res.server_error();
  }
};

exports.add_admin_user = (req, res) => {
  create_user(req, res, 1);
};

exports.update_admin_user = (req, res) => {
  update_admin_user(req, res);
};

exports.get_admin_users = (req, res) => {
  get_admin_users(req, res);
};

exports.get_data_for_create_admin_user = (req, res) => {
  get_data_for_admin_user(req, res, true);
};

exports.get_data_for_update_admin_user = (req, res) => {
  get_data_for_admin_user(req, res, false);
};

exports.change_password_admin_user = (req, res) => {
  change_password_admin_user(req, res);
};

exports.add_store_user = (req, res) => {
  create_user(req, res, 2);
};

exports.get_store_users = (req, res) => {
  get_store_users(req, res);
};

exports.get_data_for_create_store_user = (req, res) => {
  get_data_for_admin_user(req, res, true);
};

exports.get_data_for_update_store_user = (req, res) => {
  get_data_for_admin_user(req, res, false);
};