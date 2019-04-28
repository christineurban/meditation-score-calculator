const mongoose = require('mongoose'),
      dateUtil = require('../util/date');

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
    type: Number, // 20190922
    required: 'A Season must have a start date'
  },
  endDate: {
    type: Number, // 20191221
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
  const totalDays = (dateUtil.parseString(date) - dateUtil.parseString(this.startDate)) / (60 * 60 * 24 * 1000) + 1;
  const totalMinutes = this.days.reduce((minutes, day) => {
    return day.totalMinutes + minutes;
  }, 0);

  this.score = Math.round(totalMinutes / (totalDays * this.minutesPerDayRequired));
};


mongoose.model('Season', SeasonSchema);
