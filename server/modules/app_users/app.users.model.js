import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import configJWT from '../../config/jwt';

let App_UserSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	photo: {type: mongoose.Schema.Types.ObjectId, ref: 'Archive'},
	fullName: String,
	gender: String,
	country: String,
	email: {type: String, unique: true, required: true, index: true},
	facebookId: String,
	pushToken: String,
	hash: String,
	salt: String
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

App_UserSchema.pre('save', async function(next) {
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

App_UserSchema.methods.generateJwt = function() {
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 10000);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		fullName: this.fullName,
		exp: parseInt(expiry.getTime() / 1000),
	}, configJWT.TOKEN_SECRET);
}

mongoose.model('App_User', App_UserSchema);