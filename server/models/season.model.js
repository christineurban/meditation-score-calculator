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
  endOfSeasonName: {
    type: String,
    trim: true,
    enum: ['Spring Equinox', 'Summer Solstice', 'Fall Equinox', 'Winter Solstice'],
    required: 'Please provide the end of season name for this Season'
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
    type: Number,
    default: 0
  },
  _userId: {
    type: String,
    trim: true,
    required: 'An Season must belong to an user',
    select: false
  }
});

/**
 * Calculate meditation score
 */
SeasonSchema.methods.calculateScore = function(date) {
  const totalDays = (dateUtil.getMoment(date) - dateUtil.getMoment(this.startDate)) / (60 * 60 * 24 * 1000) + 1;

  let totalMinutes = 0;

  // eslint-disable-next-line handle-callback-err
  this.populate('days', (err, season) => {
    const days = season.days;

    for (let i = 0; i < days.length; i++) {
      totalMinutes += days[i].totalMinutes;
    }

    this.score = Math.round((totalMinutes / (totalDays * this.minutesPerDayRequired)) * 100);

    return this.save();
  });
};


mongoose.model('Season', SeasonSchema);
