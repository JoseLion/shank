'use strict';

let express = require('express');
let router = express.Router();

let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');

let constants = require('../../config/constants');

module.exports = function () {
	router.post('/loginAdmin', function (req, res) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				res.serverError();
				return;
			}

			if (info) {
				res.ok({}, info.message);
				return;
			}

			if (user) {
				if (user.profile.acronyms === 'admin' && user.status) {
					res.ok({user: user, token: user.generateJwt([]), response: ''});
				} else {
					res.ok({}, constants.user.disabled);
				}
			} else {
				res.ok({}, constants.user.notFound);
			}

			return;
		})(req, res);
	})

	.post('/login', function (req, res) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				res.serverError();
				return;
			}

			if (info) {
				res.ok({}, info.message);
				return;
			}

			if (user) {
				if (user.status) {
					res.ok({user: user, token: user.generateJwt([]), response: ''});
				}
				else {
					res.ok({}, constants.user.disabled);
				}
			} else {
				res.ok({}, constants.user.notFound);
			}
			
			return;
		})(req, res);
	});

	return router;
};
