import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import configJWT from '../../config/jwt';
import date_service from '../services/date.services';

let App_UserSchema = new mongoose.Schema({
	fullName: String,
	photo: {type: mongoose.Schema.Types.ObjectId, ref: 'Archive'},
	gender: String,
	country: String,
	register_os: String,
	email: {type: String, unique: true, required: true, index: true},
	isFacebookUser: {type: Boolean, default: false},
	notifications: [{
		os: String,
		token: String
	}],
	hash: String,
	salt: String,
	enabled: {type: Boolean, default: true},
	created_at: Number,
	updated_at: Number
});

App_UserSchema.pre('save', function(next) {
	if (!this.created_at) {
		this.created_at = date_service.utc_unix_current_date();
	}
	this.updated_at = date_service.utc_unix_current_date();
	next();
});

App_UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

App_UserSchema.methods.getNewPassword = function(password) {
	let salt = crypto.randomBytes(16).toString('hex');
	let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	return {salt: salt, hash: hash};
}

App_UserSchema.methods.validPassword = function(password) {
	if (!this.salt) {
		return false;
	}

	let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
}

App_UserSchema.methods.generateJwt = function(permissions) {
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 10000);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		fullName: this.fullName,
		exp: parseInt(expiry.getTime() / 1000),
		permissions: permissions
	}, configJWT.TOKEN_SECRET);
}

mongoose.model('App_User', App_UserSchema);