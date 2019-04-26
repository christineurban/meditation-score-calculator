const path = require('path'),
      errorHandler = require(path.resolve('./server/controllers/errors.controller')),
      mongoose = require('mongoose');

const Season = mongoose.model('Season');

exports.seasonById = seasonById;
exports.listSeasons = listSeasons;
exports.loadSeason = loadSeason;
exports.saveNewSeason = saveNewSeason;
exports.updateSeason = updateSeason;
exports.removeSeason = removeSeason;
exports.getCurrentSeason = getCurrentSeason;

/**
 * Season middleware
 */
async function seasonById(req, res, next, id) {
  let season;

  // Check if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorHandler.handleError(res, 400, 'Season is invalid');
  }

  try {
    // Find the season
    season = await Season.findOne({
      _id: id,
      _userId: req.user._id
    });
  } catch (e) {
    return errorHandler.handleError(res, 404, e);
  }

  if (!season) {
    return errorHandler.handleError(res, 400, `Failed to load Season ${id}`);
  }

  // Set the season on the request object so the following functions can access it
  req.season = season;
  next();
}

async function listSeasons(req, res) {
  /*
   * Find the 20 most recent seasons
   */
  let query = Season
    .find({ _userId: req.user._id })
    .sort('-updatedAt')
    .limit(20);

  const seasons = await query.exec();

  // Send the seasons to the ui
  res.json(seasons);
}

function loadSeason(req, res) {
  // Return the season
  res.json(req.season);
}

async function saveNewSeason(req, res) {
  // Start by creating a new season out of the request body
  let season = new Season(req.body);

  // And fill out the user field (don't trust the ui)
  season._userId = req.user._id;

  // Then save the season
  try {
    season = await season.save();
  } catch (e) {
    console.log(e);
    return errorHandler.handleError(res, 500, e);
  }

  // And return the saved season to the ui
  res.json(season);
}

async function updateSeason(req, res) {
  let season = req.season;

  season.set(req.body);

  try {
    // Save the season
    season = await season.save();
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // And return it to the ui
  res.json(season);
}

async function removeSeason(req, res) {
  let season = req.season;

  try {
    // Remove the season
    await Season.findByIdAndRemove(season._id);
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // Send a success status to the ui
  res.sendStatus(200);
}

async function getCurrentSeason(req, res) {
  let date = req.body.date;

  try {
    // Remove the season
    await Season.findByIdAndRemove(season._id);
  } catch (e) {
    return errorHandler.handleError(res, 500, e);
  }

  // Send a success status to the ui
  res.sendStatus(200);
}
