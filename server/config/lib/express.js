/**
 * Module dependencies.
 */
let config = require('../config'),
    express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    connectMongo = require('connect-mongo'),
    favicon = require('serve-favicon'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    path = require('path'),
    _ = require('lodash'),
    lusca = require('lusca');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function(app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.favicon = config.favicon;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function(app) {
  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';

    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
      }

      return next();
    });
  }

  // Request body parsing middleware
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Limit is a required setting; the default limit is set to 100kb.
  app.use(bodyParser.json({ limit: '5mb' }));

  // Add the cookie parser middleware
  app.use(cookieParser());
};

/**
 * Configure Express session
 */
module.exports.initSession = function(app, connection) {
  let MongoStore = connectMongo(session);
  // Express MongoDB session storage

  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    name: config.sessionKey,
    store: new MongoStore({
      mongooseConnection: connection,
      collection: config.sessionCollection
    })
  }));

  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
};

/**
 * Invoke passport configuration
 */
module.exports.initPassportConfiguration = function(app) {
  require('./passport')(app);
};

/**
 * Configure Helmet headers configuration for security
 */
module.exports.initHelmetHeaders = function(app) {
  // Six months expiration period specified in seconds
  let SIX_MONTHS = 15778476;

  app.use(helmet.frameguard({
    action: 'allow-from',
    domain: process.env.DOMAIN_MARKETING
  }));
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubDomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function(app) {
  // Only serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('client/build')));

    app.get(/^((?!api).)*$/gm, (req, res) => {
      res.sendFile(path.resolve('client/build', 'index.html'));
    });
  }
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function(app) {
  // Globbing policy files
  config.files.server.policies.forEach((policyPath) => {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function(app) {
  // Globbing routing files
  config.files.server.routes.forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function(app) {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function(connection) {
  // Initialize express app
  let app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, connection);

  // Initialize Passport configuration
  this.initPassportConfiguration(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  return app;
};
