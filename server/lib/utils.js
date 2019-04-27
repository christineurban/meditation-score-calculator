exports.normalizeDate = normalizeDate;
exports.getDateString = getDateString;
exports.parseDateString = parseDateString;

/**
 * Sets time to midnight on a date.
 */
function normalizeDate(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

function getDateString(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function parseDateString(dateString) {
  const parsed = dateString.split('-');

  return {
    year: parsed[0],
    month: parsed[1],
    day: parsed[0]
  };
}
