/**
 * Module dependencies.
 */
let config = require('../config'),
    chalk = require('chalk'),
    path = require('path'),
    mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function(callback) {
  // Globbing model files
  config.files.server.models.forEach((modelPath) => {
    require(path.resolve(modelPath));
  });

  if (callback) {
    return callback();
  }
};

// Initialize Mongoose
module.exports.connect = function(callback) {
  mongoose.Promise = config.db.promise;

  mongoose
    .connect(config.db.uri, config.db.options || {})
    .then((connection) => {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (callback) {
        return callback(mongoose.connection);
      }
    })
    .catch((err) => {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });

  mongoose.set('useCreateIndex', true);
};

module.exports.disconnect = function(cb) {
  mongoose.connection.db
    .close((err) => {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      return cb(err);
    });
};
