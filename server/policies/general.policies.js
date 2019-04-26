/**
 * Module dependencies.
 */
let acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/me',
      permissions: '*'
    }, {
      resources: '/api/users/password',
      permissions: '*'
    }, {
      resources: '/api/meditations',
      permissions: '*'
    }, {
      resources: '/api/meditations/:meditationId',
      permissions: '*'
    }, {
      resources: '/api/days',
      permissions: '*'
    }, {
      resources: '/api/days/:dayId',
      permissions: '*'
    }, {
      resources: '/api/seasons',
      permissions: '*'
    }, {
      resources: '/api/currentSeason',
      permissions: '*'
    }, {
      resources: '/api/seasons/:seasonId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check if policy allows
 */
exports.isAllowed = function(req, res, next) {
  let roles = req.user ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    } else {
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }
  });
};
