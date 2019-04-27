/**
 * Module dependencies
 */
let _ = require('lodash'),
    path = require('path'),
    validator = require('validator'),
    errorHandler = require('./errors.controller');

let whitelistedFields = ['firstName', 'lastName', 'email'];

exports.me = me;
exports.update = update;

/**
 * Update user details
 */
function update(req, res) {
  // Init Variables
  let user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user = _.extend(user, _sanitizeUser(user));
    user.save((err) => {
      if (err) {
        return errorHandler.handleError(res, 500, err);
      } else {
        req.login(user, (err) => {
          if (err) {
            errorHandler.handleError(res, 400, err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    errorHandler.handleError(res, 401, 'User is not signed in');
  }
}

/**
 * Send User
 */
function me(req, res) {
  res.json(_sanitizeUser(req.user));
}

// User sanitation
function _sanitizeUser(user) {
  let safeUserObject = null;

  if (user) {
    safeUserObject = {
      createdAt: user.createdAt,
      roles: user.roles,
      profileImageURL: user.profileImageURL,
      email: validator.escape(user.email),
      lastName: validator.escape(user.lastName).replace('&#x27;', '\''),
      firstName: validator.escape(user.firstName).replace('&#x27;', '\'')
    };
  }
  return safeUserObject;
}
