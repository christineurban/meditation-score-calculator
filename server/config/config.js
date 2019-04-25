/* eslint-disable no-console */

/**
 * Module dependencies.
 */
let _ = require('lodash'),
    chalk = require('chalk'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path');

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = function(globPatterns, excludes) {
  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);

      if (excludes) {
        files = files.map((file) => {
          let processedFile = file;

          if (_.isArray(excludes)) {
            for (let i in excludes) {
              if (Object.prototype.hasOwnProperty.call(excludes, i)) {
                processedFile = file.replace(excludes[i], '');
              }
            }
          } else {
            processedFile = file.replace(excludes, '');
          }
          return processedFile;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Validate NODE_ENV existence
 */
let validateEnvironmentVariable = function() {
  let environmentFiles = glob.sync(`./server/config/env/${process.env.NODE_ENV}.js`);

  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red(
        `+ Error: No configuration file found for "${process.env.NODE_ENV}" environment using development instead`
      ));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};

/**
 * Validate config.domain is set
 */
let validateDomainIsSet = function(config) {
  if (!config.domain) {
    console.log(chalk.red(
      '+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'
    ));
  }
};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
let validateSecureMode = function(config) {
  if (!config.secure || config.secure.ssl !== true) {
    return true;
  }

  let privateKey = fs.existsSync(path.resolve(config.secure.privateKey));

  let certificate = fs.existsSync(path.resolve(config.secure.certificate));

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log(chalk.red(
      '  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'
    ));
    console.log();
    config.secure.ssl = false;
  }
};

/**
 * Validate Session Secret parameter is not set to default in production
 */
let validateSessionSecret = function(config, testing) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (config.sessionSecret === 'GOLD') {
    if (!testing) {
      console.log(chalk.red(
        '+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'
      ));
      console.log(chalk.red(
        '  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '
      ));
      console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`'));
      console.log();
    }
    return false;
  } else {
    return true;
  }
};

/**
 * Initialize global configuration files
 */
let initGlobalConfigFolders = function(config, assets) {
  // Appending files
  config.folders = {
    server: {},
    client: {}
  };

  // Setting globbed client paths
  config.folders.client = getGlobbedPaths(
    path.join(process.cwd(), 'client/build'), process.cwd().replace(new RegExp(/\\/g), '/')
  );
};

/**
 * Initialize global configuration files
 */
let initGlobalConfigFiles = function(config, assets) {
  // Appending files
  config.files = {
    server: {}
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);
};

/**
 * Initialize global configuration
 */
let initGlobalConfig = function() {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();

  // Get the default assets
  let defaultAssets = require(path.join(process.cwd(), 'server/config/assets/default'));

  // Get the current assets
  let environmentAssets = require(path.join(process.cwd(), 'server/config/assets/', process.env.NODE_ENV)) || {};

  // Merge assets
  let assets = _.merge(defaultAssets, environmentAssets);

  // Get the default config
  let defaultConfig = require(path.join(process.cwd(), 'server/config/env/default'));

  // Get the current config
  let environmentConfig = require(path.join(process.cwd(), 'server/config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  let config = _.merge(defaultConfig, environmentConfig);

  // Read package.json for GoldenRay project information
  let pkg = require(path.resolve('./package.json'));

  config.medScoreCalc = pkg;

  // Extend the config object with the local-NODE_ENV.js custom/local environment.
  // This will override any settings present in the local configuration.
  config = _.merge(config, (fs.existsSync(
    path.join(process.cwd(), `server/config/env/local-${process.env.NODE_ENV}.js`)
  ) && require(path.join(process.cwd(), `server/config/env/local-${process.env.NODE_ENV}.js`))) || {});

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Validate session secret
  validateSessionSecret(config);

  // Print a warning if config.domain is not set
  validateDomainIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths,
    validateSessionSecret
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
