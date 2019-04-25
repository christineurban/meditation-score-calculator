module.exports.do = checkDatabaseVersion;

function checkDatabaseVersion() {
  if (process.env.NODE_ENV === 'test') {
    return 0;
  }
}
