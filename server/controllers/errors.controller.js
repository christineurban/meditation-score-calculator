/**
 * Module dependencies
 */
// var path = require('path'),
//     config = require(path.resolve('./server/config/config'));

/**
 * Get unique error field name
 */
// TODO: fix
// var getUniqueErrorMessage = function(err) {
//   var output;

//   try {
//     var begin = 0;

//     if (err.errmsg.lastIndexOf('.$') !== -1) {
//       /*
//        * Support mongodb <= 3.0 (default: MMapv1 engine)
//        * "errmsg" : "E11000 duplicate key error index: mean-dev.users.$email_1 dup key: { : \"test@user.com\" }"
//        */
//       begin = err.errmsg.lastIndexOf('.$') + 2;
//     } else {
//       /*
//        * Support mongodb >= 3.2 (default: WiredTiger engine)
// eslint-disable-next-line max-len
//        * "errmsg" : "E11000 duplicate key error collection: mean-dev.users index: email_1 dup key: { : \"test@user.com\" }"
//        */
//       begin = err.errmsg.lastIndexOf('index: ') + 7;
//     }
//     var fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'));

//     output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
//   } catch (ex) {
//     output = 'Unique field already exists';
//   }

//   return output;
// };

/**
 * Get the error message from error object
 */
exports.handleError = function(res, statusCode, e) {
  // Show 5xx server-side errors in the console
  if (Math.floor(statusCode / 100) === 5) {
    // TODO: should throw instead of console, but sometimes displays UnhandledPromiseRejectionWarning
    console.error(e);
  } else {
    // Show 4xx client-side errors in the browser
    res.statusMessage = e;
  }

  return res.status(statusCode).send();
};
