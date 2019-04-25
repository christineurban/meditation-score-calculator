/**
 * Module dependencies.
 */

require('dotenv').config();

let config = require('../config'),
    mongooseService = require('./mongoose'),
    express = require('./express'),
    chalk = require('chalk'),
    checkDatabaseVersion = require('../../scripts/checkDatabaseVersion');

checkDatabaseVersion.do();

module.exports.init = function init(callback) {
  mongooseService.connect((connection) => {
    // Initialize Models
    mongooseService.loadModels();

    // Initialize express
    let app = express.init(connection);

    if (callback) {
      return callback(app, connection.db, config);
    }
  });
};

module.exports.start = function start(callback) {
  let _this = this;

  _this.init((app, db, _config) => {
    // Start the app by listening on <port> at <host>
    app.listen(_config.port, _config.host, () => {
      // Create server URL
      let server = `${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + _config.host}:${_config.port}`;
      // Logging initialization

      console.log('--');
      console.log(chalk.green(_config.app.title));
      console.log();
      console.log(chalk.green(`Environment:     ${process.env.NODE_ENV}`));
      console.log(chalk.green(`Server:          ${server}`));
      console.log(chalk.green(`Database:        ${_config.db.uri}`));
      console.log(chalk.green(`App version:     ${_config.medScoreCalc.version}`));
      console.log('--');

      if (callback) {
        return callback(app, db, _config);
      }
    });
  });
};
