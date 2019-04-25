let defaultEnvConfig = require('./default');

module.exports = {
  db: {
    options: {},
    uri: process.env.MONGOHQ_URL
      || process.env.MONGODB_URI
      || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/med-score-calc`,
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {

    /*
     * Logging with Morgan - https://github.com/expressjs/morgan
     * Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
     *
     *format: 'dev',
     *fileLogger: {
     *  directoryPath: process.cwd(),
     *  fileName: 'app.log',
     *  maxsize: 10485760,
     *  maxFiles: 2,
     *  json: false
     *}
     */
  },
  app: {
    title: `${defaultEnvConfig.app.title} - Development Environment`
  }
};
