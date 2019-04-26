/**
 * Module dependencies.
 */
let policy = require('../policies/general.policies'),
    users = require('../controllers/users.controller'),
    auth = require('../controllers/authentication.controller'),
    password = require('../controllers/password.controller'),
    meditations = require('../controllers/meditations.controller');

module.exports = function(app) {
  // Setting up the authentication api
  app.route('/api/auth/signup').post(auth.signup);
  app.route('/api/auth/signin').post(auth.signin);
  app.route('/api/auth/signout').get(auth.signout);

  // Setting up the reset password api
  app.route('/api/auth/forgot').post(password.forgot);
  app.route('/api/auth/reset/:token').get(password.validateResetToken);
  app.route('/api/auth/reset/:token').post(password.reset);

  // Setting up the users profile api
  app.route('/api/users/me').all(policy.isAllowed)
    .get(users.me);
  app.route('/api/users').all(policy.isAllowed)
    .put(users.update);
  app.route('/api/users/password').all(policy.isAllowed)
    .post(password.changePassword);

  // Meditation routes
  app.route('/api/meditations').all(policy.isAllowed)
    .get(meditations.listMeditations)
    .post(meditations.saveNewMeditation);
  app.route('/api/meditations/:meditationId').all(policy.isAllowed)
    .get(meditations.loadMeditation)
    .post(meditations.updateMeditation)
    .delete(meditations.removeMeditation);
  // Finish by binding the meditation middleware
  app.param('meditationId', meditations.meditationById);
};
