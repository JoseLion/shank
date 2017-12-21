let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = mongoose.model('User');
let constants = require('./constants');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function(username, password, done) {
    User.findOne({ email: username })
    .populate('profile')
    .exec(function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, {
                message: constants.user.notFound
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: constants.user.password
            });
        }
        return done(null, user);
    });
}));
