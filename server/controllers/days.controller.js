const mongoose = require('mongoose'),
      errorHandler = require('./errors.controller');

const Day = mongoose.model('Day');

exports.dayById = dayById;
exports.getDayByDate = getDayByDate;
exports.listDays = listDays;
exports.loadDay = loadDay;
exports.saveNewDay = saveNewDay;
exports.updateDay = updateDay;
exports.removeDay = removeDay;

/**
 * Day middleware
 */
async function dayById(req, res, next, id) {
  let day;

  // Check if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorHandler.handleError(res, 400, 'Day is invalid');
  }

  try {
    // Find the day
    day = await Day.findOne({
      _id: id,
      _userId: req.user._id
    });
  } catch (e) {
    return errorHandler.handleError(res, 404, e);
  }

  if (!day) {
    return errorHandler.handleError(res, 400, `Failed to load Day ${id}`);
  }

  // Set the day on the request object so the following functions can access it
  req.day = day;
  next();
}

async function getDayByDate(date, season, minutes, user) {
  let day;

  // check if the day exists
  try {
    day = await Day.findOne({
      _userId: user._id,
      date
    });
  } catch (e) {
    throw new Error('Error finding Day:', e);
  }

  // if it does not, make one based on current date sent from the client
  if (!day) {
    day = await saveNewDay(date, season, user);
  }

  // add the meditation minutes
  day.totalMinutes += minutes;

  // Then save the meditation
  try {
    day = await day.save();
  } catch (e) {
    throw new Error('Error saving Day', e);
  }

  return day;
}

async function listDays(req, res) {
  /*
   * Find the 20 most recent days
   */
  let query = Day
    .find({ _userId: req.user._id })
    .sort('-updatedAt')
    .limit(20);

  const days = await query.exec();

  // Send the days to the ui
  res.json(days);
}

function loadDay(req, res) {
  // Return the day
  res.json(req.day);
}

async function saveNewDay(date, season, user) {
  // Make a season with the data
  let day = new Day({
    _userId: user._id,
    date,
    season: season._id
  });

  // Save the day
  try {
    day = await day.save();
  } catch (e) {
    throw new Error('Error saving Day', e);
  }

  // Lastly add the day to the season
  season.days.addToSet(day._id);

  return day;
}

async function updateDay(req, res) {
  let day = req.day;

  day.set(req.body);

  try {
    // Save the day
    day = await day.save();
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // And return it to the ui
  res.json(day);
}

async function removeDay(req, res) {
  let day = req.day;

  try {
    // Remove the day
    await Day.findByIdAndRemove(day._id);
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // Send a success status to the ui
  res.sendStatus(200);
}
