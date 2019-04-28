const mongoose = require('mongoose'),
      daysController = require('./days.controller'),
      seasonsController = require('./seasons.controller'),
      errorHandler = require('./errors.controller');

const Meditation = mongoose.model('Meditation');

exports.meditationById = meditationById;
exports.listMeditations = listMeditations;
exports.loadMeditation = loadMeditation;
exports.saveNewMeditation = saveNewMeditation;
exports.updateMeditation = updateMeditation;
exports.removeMeditation = removeMeditation;

/**
 * Meditation middleware
 */
async function meditationById(req, res, next, id) {
  let meditation;

  // Check if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorHandler.handleError(res, 400, 'Meditation is invalid');
  }

  try {
    // Find the meditation
    meditation = await Meditation.findOne({
      _id: id,
      _userId: req.user._id
    });
  } catch (e) {
    return errorHandler.handleError(res, 404, e);
  }

  if (!meditation) {
    return errorHandler.handleError(res, 400, `Failed to load Meditation ${id}`);
  }

  // Set the meditation on the request object so the following functions can access it
  req.meditation = meditation;
  next();
}

async function listMeditations(req, res) {
  /*
   * Find the 20 most recent meditations
   */
  let query = Meditation
    .find({ _userId: req.user._id })
    .sort('-updatedAt')
    .limit(20);

  const meditations = await query.exec();

  // Send the meditations to the ui
  res.json(meditations);
}

function loadMeditation(req, res) {
  // Return the meditation
  res.json(req.meditation);
}

async function saveNewMeditation(req, res) {
  const date = req.body.date;
  // start by getting/creating a season
  const season = seasonsController.getSeasonByDate(date, -(date.getTimezoneOffset() / 60), req.user);
  // then get/create a day and pass the minutes to it
  const day = daysController.getDayByDate(date, season, req.body.minutes, req.user);

  // Create a new meditation out of the request body
  let meditation = new Meditation(req.body);

  // And fill out the user field (don't trust the ui)
  meditation._userId = req.user._id;

  // Then save the meditation
  try {
    meditation = await meditation.save();
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // Add the meditation to the day
  day.meditations.addToSet(meditation._id);

  // And the day to the meditation
  meditation.day = day._id;

  // Trigger a season score calculation
  seasonsController.calculateScore(season, date);

  // And return the saved meditation to the ui
  res.json(meditation);
}

async function updateMeditation(req, res) {
  let meditation = req.meditation;

  meditation.set(req.body);

  try {
    // Save the meditation
    meditation = await meditation.save();
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // And return it to the ui
  res.json(meditation);
}

async function removeMeditation(req, res) {
  let meditation = req.meditation;

  try {
    // Remove the meditation
    await Meditation.findByIdAndRemove(meditation._id);
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // Send a success status to the ui
  res.sendStatus(200);
}
