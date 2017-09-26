var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
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