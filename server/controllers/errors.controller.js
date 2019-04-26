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
