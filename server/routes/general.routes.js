/**
 * Module dependencies.
 */
let policy = require('../policies/general.policies'),
    users = require('../controllers/users.controller'),
    auth = require('../controllers/authentication.controller'),
    password = require('../controllers/password.controller'),
    meditations = require('../controllers/meditations.controller'),
    days = require('../controllers/days.controller'),
    seasons = require('../controllers/seasons.controller');

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

  // Day routes
  app.route('/api/days').all(policy.isAllowed)
    .get(days.listDays)
    .post(days.saveNewDay);
  app.route('/api/days/:dayId').all(policy.isAllowed)
    .get(days.loadDay)
    .post(days.updateDay)
    .delete(days.removeDay);
  // Finish by binding the day middleware
  app.param('dayId', days.dayById);

  // Season routes
  app.route('/api/seasons').all(policy.isAllowed)
    .get(seasons.listSeasons)
    .post(seasons.saveNewSeason);
  app.route('/api/seasons/:seasonId').all(policy.isAllowed)
    .get(seasons.loadSeason)
    .post(seasons.updateSeason)
    .delete(seasons.removeSeason);
  app.route('/api/currentSeason').all(policy.isAllowed)
    .get(seasons.getCurrentSeason);
  // Finish by binding the season middleware
  app.param('seasonId', seasons.seasonById);
};
