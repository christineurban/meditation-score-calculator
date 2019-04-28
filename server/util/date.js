exports.parseString = parseString;
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getDay = getDay;
exports.parseData = parseData;

/**
 * Sets time to midnight on a date.
 */
function parseString(date) {
  return parseInt(`${date.slice(0, 4)}${date.slice(5, 7)}${date.slice(8, 10)}`);
}

function getYear(date) {
  return parseInt(date.slice(0, 4));
}

function getMonth(date) {
  return parseInt(date.slice(5, 7));
}

function getDay(date) {
  return parseInt(date.slice(8, 10));
}

function parseData(data) {
  return parseInt(`${data.year}${data.month}${data.day}`);
}
