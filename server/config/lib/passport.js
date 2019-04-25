/**
 * Module dependencies
 */
let passport = require('passport'),
    passportLocal = require('passport-local'),
    mongoose = require('mongoose');

let LocalStrategy = passportLocal.Strategy,
    User = mongoose.model('User');

/**
 * Module init function
 */
module.exports = function(app) {
  // Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id
    }, '-salt -password', (err, user) => {
      done(err, user);
    });
  });

  // Initialize local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({
      email: email.toLowerCase()
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: `Invalid email or password (${(new Date()).toLocaleTimeString()})`
        });
      }

      return done(null, user);
    });
  }));

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
