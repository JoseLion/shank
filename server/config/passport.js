let  passport = require('passport');
let  LocalStrategy = require('passport-local').Strategy;
let  mongoose = require('mongoose');
let  User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
function(username, password, done) {
    User.findOne({ email: username })
        .populate('profile')
        .exec(function (err, user) {
            if (err) { return done(err); }
            // Return if users not found in database
            if (!user) {
                return done(null, false, {
                    message: 'Usuario no encontrado.'
                });
            }
            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'La contraseña es incorrecta.'
                });
            }
            // If credentials are correct, return the users object
            return done(null, user);
        });
}
));
