let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let configJWT = require('../../config/jwt');
let keys_utils = require('../utils/keys.utils');

let Admin_UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  cell_phone: String,
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  role: {type: Number, default: 1},
  salt: String,
  hash: String,
  enabled: {type: Boolean, default: true}
},
{ timestamps: { createdAt: 'created_at' } });

Admin_UserSchema.post('save', (error, doc, next) => {
  if (error.name === 'BulkWriteError' && error.code === 11000) {
    let index_name = keys_utils.get_key_error(error.message);
    next(new Error(index_name + ' already exists!'));
  }
  else {
    next(error);
  }
});

Admin_UserSchema.post('findOneAndUpdate', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000 && error.codeName === 'DuplicateKey') {
    let index_name = keys_utils.get_key_error(error.message);
    next(new Error(index_name + ' already exists!'));
  }
  else {
    next(error);
  }
});

Admin_UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
};

Admin_UserSchema.methods.getNewPassword = function(password) {
  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  return {salt: salt, hash: hash};
};

Admin_UserSchema.methods.validPassword = function(password) {
  
  if (!this.salt) {
    return false;
  }
  
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

Admin_UserSchema.methods.generateJwt = function(permissions) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 10000);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    surname: this.surname,
    exp: parseInt(expiry.getTime() / 1000), 
    permissions: permissions
  }, configJWT.TOKEN_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('Admin_User', Admin_UserSchema);