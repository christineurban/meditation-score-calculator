require('dotenv').config();

module.exports = {
  app: {
    title: 'Meditation Score Calculator',
    description: 'Calculate your quarterly meditation score by the solstice or equinox.',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  db: {
    promise: global.Promise,
    options: {
      useNewUrlParser: true
    }
  },
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV,
  /*
   * DOMAIN config should be set to the fully qualified application accessible
   * URL. For example: https://www.myapp.com (including port if required).
   */
  domain: {
    prod: process.env.DOMAIN,
    marketing: process.env.DOMAIN_MARKETING
  },
  // Session Cookie settings
  sessionCookie: {
    // Session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    /*
     * HttpOnly flag makes sure the cookie is only accessed
     * through the HTTP protocol and not JS/browser
     */
    httpOnly: true,
    /*
     * Secure cookie should be turned to true to provide additional
     * layer of security so that the cookie is set only when working
     * in HTTPS mode.
     */
    secure: false
  },
  // SessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'GOLD',
  // SessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  favicon: 'client/public/favicon.ico',
  mailer: {
    from: process.env.MAILER_EMAIL,
    options: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: 'true',
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS
      }
    }
  }
};
