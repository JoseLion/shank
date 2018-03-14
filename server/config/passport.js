import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import constants from './constants';

const User = mongoose.model('User');
const Strategy = LocalStrategy.Strategy;

export default function() {
	passport.use(new Strategy({usernameField: 'email'}, function(username, password, done) {
		User.findOne({ email: username }).populate('profile').exec(function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					message: constants.user.notFound
				});
			}

			if (!user.validPassword(password)) {
				return done(null, false, {message: constants.user.password});
			}

			return done(null, user);
		});
	}));
}