/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
      passport = require('passport'),
      validator = require('validator'),
      errorHandler = require('./errors.controller');

const User = mongoose.model('User');

exports.signup = signup;
exports.signin = signin;
exports.signout = signout;


async function signup(req, res) {
  let user;

  try {
    user = await new User({
      email: validator.escape(req.body.email),
      firstName: validator.escape(req.body.firstName).replace('&#x27;', '\''),
      lastName: validator.escape(req.body.lastName).replace('&#x27;', '\''),
      password: req.body.password
    });
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  try {
    user = await user.save();
  } catch (e) {
    if (typeof e === 'string') {
      return res.send({ error: e });
    } else {
      return errorHandler.handleError(res, 500, e);
    }
  }

  // Remove sensitive data before login
  user.password = undefined;
  user.salt = undefined;

  req.login(user, (err) => {
    if (err) {
      errorHandler.handleError(res, 400, err);
    } else {
      res.json(user);
    }
  });
}

function signin(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      errorHandler.handleError(res, 401, info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, (err) => {
        if (err) {
          errorHandler.handleError(res, 400, err);
        } else {
          res.json(_sanitizeUser(user));
        }
      });
    }
  })(req, res, next);
}

function signout(req, res) {
  req.logout();
  res.send({});
}

// User sanitation
function _sanitizeUser(user) {
  let safeUserObject = null;

  if (user) {
    safeUserObject = {
      roles: user.roles,
      profileImageURL: user.profileImageURL,
      email: validator.escape(user.email),
      lastName: validator.escape(user.lastName).replace('&#x27;', '\''),
      firstName: validator.escape(user.firstName).replace('&#x27;', '\'')
    };
  }
  return safeUserObject;
}
