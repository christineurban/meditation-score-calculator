const mongoose = require('mongoose'),
      utils = require('../lib/utils');

const Schema = mongoose.Schema;

/**
 * Season Schema
 */
const SeasonSchema = new Schema({
  name: {
    type: String,
    trim: true,
    enum: ['Spring', 'Summer', 'Fall', 'Winter'],
    required: 'Please provide the name of this Season'
  },
  startDate: {
    type: String, // 2019-09-22
    trim: true,
    required: 'A Season must have a start date'
  },
  endDate: {
    type: String, // 2019-12-21
    trim: true,
    required: 'A Season must have a end date'
  },
  adjustedStartDate: {
    type: Date
  },
  days: [{
    type: Schema.ObjectId,
    ref: 'Day'
  }],
  minutesPerDayRequired: {
    type: Number,
    default: 90
  },
  score: {
    type: Number
  },
  _userId: {
    type: String,
    trim: true,
    required: 'An Season must belong to an user',
    select: false
  }
});

/**
 * Calculate meditation score before saving
 */
SeasonSchema.methods.calculateScore = function(date) {
  const totalDays = (utils.normalizeDate(date) - utils.normalizeDate(this.startDate)) / (60 * 60 * 24 * 1000) + 1;
  const totalMinutes = this.days.reduce((minutes, day) => {
    return day.totalMinutes + minutes;
  }, 0);

  this.score = Math.round(totalMinutes / (totalDays * this.minutesPerDayRequired));
};

/**
 * Get upcoming Solstice/Equinox name
*/
SeasonSchema.methods.getUpcomingName = function() {
  const nextSeasonMap = {
    spring: 'Summer Solstice',
    summer: 'Fall Equinox',
    fall: 'Winter Solstice',
    winter: 'Spring Equinox'
  };

  return nextSeasonMap[this.name];
};


mongoose.model('Season', SeasonSchema);
