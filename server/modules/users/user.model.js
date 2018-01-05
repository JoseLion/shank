let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let configJWT = require('../../config/jwt');
let Counter = mongoose.model('Counter');

let UserSchema = new mongoose.Schema({
    _id: Number,
    creationDate: { type: Date, default: Date.now() },
    updateDate: Date,
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
    cellPhone: String,

    profile: {
        type: Number,
        ref: 'Profile',
        default: 2
    },
    bettingGroups: [ {type: Number, ref: 'BettingGroup'} ],

    facebookId: String,
    hash: String,
    salt: String
});

UserSchema.pre('save', function(next) {
    let self = this;
    if(self._id == null) {
        Counter.getNextSequence('users', function(err, counter) {
            if(err) {
                self._id = -1;
                next(err)
            } else {
                self._id = counter.seq
                next();
            }
        });
    } else {
        self.updateDate = new Date();
        next();
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
    this.bettingGroups.push(_id);
};

mongoose.model('User', UserSchema);
