/**
 * Module dependencies
 */
const config = require('../config/config'),
      errorHandler = require('./errors.controller'),
      mongoose = require('mongoose'),
      nodemailer = require('nodemailer'),
      asyncLib = require('async'),
      crypto = require('crypto');

const User = mongoose.model('User');

const smtpTransport = nodemailer.createTransport(config.mailer.options);

exports.forgot = forgot;
exports.validateResetToken = validateResetToken;
exports.reset = reset;
exports.changePassword = changePassword;

/**
 * Forgot for reset password (forgot POST)
 */
function forgot(req, res, next) {
  asyncLib.waterfall([
    // Generate random token
    function(done) {
      crypto.randomBytes(20, (err, buffer) => {
        let token = buffer.toString('hex');

        done(err, token);
      });
    },
    // Lookup user by username
    function(token, done) {
      if (req.body.email) {
        User.findOne({
          email: req.body.email.toLowerCase()
        }, '-salt -password', (err, user) => {
          if (err || !user) {
            return errorHandler.handleError(res, 404, 'No account with that email has been found');
          } else if (user.provider !== 'local') {
            return errorHandler.handleError(
              res,
              400,
              `It seems like you signed up using your ${user.provider} account, please sign in using that provider.`
            );
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save((err) => {
              done(err, token, user);
            });
          }
        });
      } else {
        return errorHandler.handleError(res, 400, 'Email field must not be blank');
      }
    },
    function(token, user, done) {
      let httpTransport = 'http://';

      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      let baseUrl = config.domain || httpTransport + req.headers.host;

      res.render('../templates/reset-password-email', {
        name: user.displayName,
        appName: config.app.title,
        url: `${baseUrl}/api/auth/reset/${token}`
      }, (err, emailHTML) => {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      let mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, (err) => {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return errorHandler.handleError(res, 500, 'Failure sending email');
        }

        done(err);
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
  });
}

/**
 * Reset password GET from email token
 */
function validateResetToken(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, (err, user) => {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect(`/password/reset/${req.params.token}`);
  });
}

/**
 * Reset password POST from email token
 */
function reset(req, res, next) {
  // Init Variables
  let passwordDetails = req.body;

  asyncLib.waterfall([

    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, (err, user) => {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              if (err) {
                return errorHandler.handleError(res, 500, err);
              } else {
                req.login(user, (err) => {
                  if (err) {
                    return errorHandler.handleError(res, 400, err);
                  } else {
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);

                    done(err, user);
                  }
                });
              }
            });
          } else {
            return errorHandler.handleError(res, 400, 'Passwords do not match');
          }
        } else {
          return errorHandler.handleError(res, 400, 'Password reset token is invalid or has expired.');
        }
      });
    },
    function(user, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, (err, emailHTML) => {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      let mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, (err) => {
        done(err, 'done');
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
  });
}

/**
 * Change Password
 */
function changePassword(req, res, next) {
  // Init Variables
  let passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, (err, user) => {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save((err) => {
                if (err) {
                  return errorHandler.handleError(res, 500, err);
                } else {
                  req.login(user, (err) => {
                    if (err) {
                      errorHandler.handleError(res, 400, err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              errorHandler.handleError(res, 400, 'Passwords do not match');
            }
          } else {
            errorHandler.handleError(res, 401, 'Current password is incorrect');
          }
        } else {
          errorHandler.handleError(res, 404, 'User is not found');
        }
      });
    } else {
      errorHandler.handleError(res, 400, 'Please provide a new password');
    }
  } else {
    errorHandler.handleError(res, 401, 'User is not signed in');
  }
}
