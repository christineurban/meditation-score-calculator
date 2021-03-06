const rp = require('request-promise'),
      mongoose = require('mongoose'),
      dateUtil = require('../util/date'),
      errorHandler = require('./errors.controller');

const Season = mongoose.model('Season');

exports.seasonById = seasonById;
exports.getCurrentSeason = getCurrentSeason;
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

/**
 * date: string '2019-05-01T04:52:07.457Z' (is local from client but gets converted to UTC in request)
 * tz: string '-7'
 */
async function getCurrentSeason(req, res) {
  // adjust the date to local and get the date integer
  const tz = req.body.tz;
  const date = dateUtil.parseDate(dateUtil.adjustToTimeZone(req.body.date, tz));

  let season = await _getSeasonByDate(date, req.user);

  if (!season) {
    const { start, end } = await _findApplicableSeason(
      date,
      tz,
      await _getSeasonData(dateUtil.getYear(date), tz)
    );

    const seasonName = _getSeasonName(start);

    season = {
      score: 0,
      seasonName,
      endOfSeasonName: _getEndOfSeasonName(seasonName),
      startDate: dateUtil.parseDate(start),
      endDate: dateUtil.parseDate(end)
    };
  }

  res.json(season);
}

async function getSeasonByDate(date, tz, user) {
  let season = await _getSeasonByDate(date, user);

  // if it does not, make one based on current date sent from the client
  if (!season) {
    season = await saveNewSeason(date, tz, user);
  }

  return season;
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

async function saveNewSeason(date, tz, user) {
  // make request to get common equinox and solstice data, and find the season range
  const { start, end } = await _findApplicableSeason(date, tz, await _getSeasonData(dateUtil.getYear(date), tz));
  const seasonName = _getSeasonName(start);

  // Make a season with the data
  let season = new Season({
    _userId: user._id,
    name: seasonName,
    endOfSeasonName: await _getEndOfSeasonName(seasonName),
    startDate: dateUtil.parseDate(start),
    endDate: dateUtil.parseDate(end)
  });

  // Save the season
  try {
    season = await season.save();
  } catch (e) {
    throw new Error('Error saving Season', e.message);
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

async function _getSeasonByDate(date, user) {
  let season;

  // check if the season exists
  try {
    season = await Season.findOne({
      _userId: user._id,
      startDate: { $lte: date },
      endDate: { $gte: date }
    });
  } catch (e) {
    throw new Error('Error finding Season', e);
  }

  return season;
}

function _getSeasonName(data) {
  if (data.phenom === 'Equinox') {
    return data.month <= 3 ? 'Spring' : 'Fall';
  }
  return data.month <= 6 ? 'Summer' : 'Winter';
}

function _getEndOfSeasonName(name) {
  const nextSeasonMap = {
    Spring: 'Summer Solstice',
    Summer: 'Fall Equinox',
    Fall: 'Winter Solstice',
    Winter: 'Spring Equinox'
  };

  return nextSeasonMap[name];
}

async function _getSeasonData(year, tz) {
  // https://aa.usno.navy.mil/data/docs/api.php
  let seasonData;

  try {
    seasonData = await rp(`https://api.usno.navy.mil/seasons?year=${year}&tz=${tz}&dst=true`);
  } catch (e) {
    throw new Error('Error requesting Season data', e);
  }

  return JSON.parse(seasonData).data.filter((data) => {
    return data.phenom === 'Equinox' || data.phenom === 'Solstice';
  });
}

async function _findApplicableSeason(date, tz, seasonData) {
  let start,
      end;

  // find the applicable end season
  end = seasonData.find((data) => {
    // same month, lesser day
    return dateUtil.getMonth(date) === parseInt(data.month) && dateUtil.getDay(date) <= parseInt(data.day)
    // lesser month
    || dateUtil.getMonth(date) < parseInt(data.month);
  });

  if (end) {
    if (end.month === '03') {
      // start season goes into previous year
      const prevYear = await _getSeasonData(dateUtil.getYear(date) - 1, tz);

      start = prevYear.find((past) => {
        return past.month === '12';
      });
    } else {
      // season is in the same year
      start = seasonData.find((current) => {
        return parseInt(current.month) === parseInt(end.month) - 3;
      });
    }
  } else {
    // end season goes into next year
    const nextYear = await _getSeasonData(dateUtil.getYear(date) - 1, tz);

    end = nextYear.find((future) => {
      return future.month === '03';
    });

    start = seasonData.find((current) => {
      return current.month === '12';
    });
  }

  return { start, end };
}
