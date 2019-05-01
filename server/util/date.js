const moment = require('moment');

exports.adjustToTimeZone = adjustToTimeZone;
exports.parseDate = parseDate;
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getDay = getDay;
exports.parseTime = parseTime;


const STRING_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

/**
 *
 * @param {string} date
 * @param {string} tz
 */
function adjustToTimeZone(date, tz) {
  return moment(date, STRING_FORMAT)
    .add(parseInt(tz), 'hours')
    .format(STRING_FORMAT);
}

/**
 * Returns date integer -- 20191209
 * @param {*} date string or object
 */
function parseDate(date) {
  if (typeof date === 'string') {
    return parseInt(moment(date, STRING_FORMAT).format('YYYYMMDD'));
  }

  return parseInt(`${date.year}${date.month}${date.day}`);
}

/**
 * Gets year as integer from date -- 2019
 * @param {*} date string or date integer
 */
function getYear(date) {
  if (typeof date === 'string') {
    return moment(date, STRING_FORMAT).year();
  }

  return Math.floor(date / 10000);
}

/**
 * Gets month as integer from a date -- 12
 * @param {*} date string or date integer
 */
function getMonth(date) {
  if (typeof date === 'string') {
    return moment(date, STRING_FORMAT).month() + 1
  }

  return Math.floor(date / 100) % 100 - 1;
}

/**
 * Gets day as integer from a date -- 9
 * @param {*} date string or date integer
 */
function getDay(date) {
  if (typeof date === 'string') {
    return moment(date, STRING_FORMAT).date();
  }

  return date % 100;
}

/**
 * Gets time as integer from a date -- 1330
 * @param {*} date string or date integer
 */
function parseTime(date) {
  if (typeof date === 'string') {
    return parseInt(moment(date, STRING_FORMAT).format('HHmm'));
  }

  return date % 100;
}
