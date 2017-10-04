let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let configJWT = require('../../config/jwt');

let UserSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    cell_phone: String,
    photo: {
        name: {type: String},
        path: {type: String}
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    bettingGroups: [{type: String}],
    gender: String,
    birthDate: Date,
    city: String,
    address: String,
    fb: String,
    type: {type: Number, default: 1},
    hash: String,
    salt: String,
    security_code: Number,
    enabled: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()},
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
    if (!this.salt) {
        return false;
    }
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function (permissions) {
    let expiry = new Date();
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

mongoose.model('User', UserSchema);