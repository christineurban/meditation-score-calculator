const request = require('request'),
      mongoose = require('mongoose'),
      utils = require('../lib/utils'),
      errorHandler = require('./errors.controller');

const Season = mongoose.model('Season');

exports.seasonById = seasonById;
exports.getSeasonByDate = getSeasonByDate;
exports.listSeasons = listSeasons;
exports.loadSeason = loadSeason;
exports.saveNewSeason = saveNewSeason;
exports.updateSeason = updateSeason;
exports.removeSeason = removeSeason;

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

async function getSeasonByDate(clientDate, user) {
  // reset time to midnight
  const date = utils.normalizeDate(clientDate);
  let season;

  // check if the season exists
  try {
    season = await Season.findOne({
      _userId: user._id,
      startDate: { $gte: date },
      endDate: { $lte: date }
    });
  } catch (e) {
    return errorHandler.handleError({}, 500, e);
  }

  // if it does not, make one based on current date sent from the client
  if (!season) {
    saveNewSeason(date, user);
  }

  return season;
}

async function listSeasons(req, res) {
  /*q
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

async function saveNewSeason(date, user) {
  // make request to get common equinox and solstice data
  const seasonData = _getSeasonData(date, date.getFullYear());
  let start, end;

  // find the applicable season
  seasonData.forEach((data) => {
    if (
      data.name in ['Equinox', 'Solstice']
      && ((date.getMonth() === parseInt(data.month) && date.getDay() <= parseInt(data.day)) // same month, lesser day
      || date.getMonth() < parseInt(data.month)) // lesser month
    ) {
      switch (data.month) {
        // season goes into previous year
        case 3:
          start = _getSeasonData(date, date.getFullYear() - 1).find((past) => {
            return past.month === 12;
          });

          end = data;
          break;
        // season is in the same year
        case 6:
        case 9:
        case 12:
          start = seasonData.find((current) => {
            return current.month = data.month - 3;
          });

          end = data;
          break;
        default:
          console.error('Season month not found.')
      }
    }
    else {
      // season goes into next year
      start = seasonData.find((current) => {
        return current.month = 12;
      });

      end = _getSeasonData(date, date.getFullYear() - 1).find((future) => {
        return future.month === 3;
      });
    }
  });

  // Make a season with the data
  let season = new Season({
    _userId: user._id,
    name: _getDisplayName(data),
    startDate: `${start.year}-${start.month}-${start.day}`,
    endDate: `${end.year}-${end.month}-${end.day}`
  });

  // Save the season
  try {
    season = await season.save();
  } catch (e) {
    return errorHandler.handleError({}, 500, e);
  }

  return season;
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

function _getDisplayName(item) {
  if (item.name === 'Equinox') {
      return item.month === 3 ? 'Spring Equinox' : 'Fall Equinox';
  }
  return item.month === 6 ? 'Summer Solstice' : 'Winter Solstice';
  }
};

function _getSeasonData(date, year) {
  // https://aa.usno.navy.mil/data/docs/api.php
  request(
    `https://api.usno.navy.mil/seasons?year=${year}&tz=${-(date.getTimezoneOffset() / 60)}&dst=true`,
    (error, response, body) => {
      if (error) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
      }

      return body;
    }
  );
}
