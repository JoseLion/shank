let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let configJWT = require('../../config/jwt');
let Profile = mongoose.model('Profile');

let UserSchema = new mongoose.Schema({
  status: { type: Boolean, default: true },
  photo: {
    name: {type: String},
    path: {type: String}
  },
  fullName: String,
  birthDate: Date,
  gender: String,
  country: String,
  city: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  groups: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Group'} ],
  facebookId: String,
  hash: String,
  salt: String
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

UserSchema.pre('save', function(next) {
  let self = this;

  self.fullName = self.fullName.trim();
  self.email = self.email.trim();
  if(!self.profile) {
    Profile.findOne({acronyms: 'public'}).exec((err, profile) => {
      if(err) {
        self.profile = null;
      } else {
        self.profile = profile._id;
      }
      next();
      return;
    });
  }
});

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.getNewPassword = function (password) {
  let salt = crypto.randomBytes(16).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return {salt: salt, hash: hash};
};

UserSchema.methods.validPassword = function (password) {
  if (!this.salt) { return false; }
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function (permissions) {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 10000);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    exp: parseInt(expiry.getTime() / 1000),
    permissions: permissions
  }, configJWT.TOKEN_SECRET);
};

UserSchema.methods.addGroup = function (_id) {
  this.groups.push(_id);
};

mongoose.model('User', UserSchema);
