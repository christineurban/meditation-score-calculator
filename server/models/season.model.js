const mongoose = require('mongoose');

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
    type: Date
  },
  endDate: {
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
}, {
  timestamps: true
});

/**
 * Calculate meditation score before saving
 */
SeasonSchema.pre('save', function(next) {
  const totalDays = (_normalizeDate(new Date()) - _normalizeDate(this.startDate)) / (60 * 60 * 24 * 1000) + 1;
  const subScore = this.days.reduce((accum, day) => {
    return day.totalMinutes + accum;
  }, 0);

  this.score = Math.round(subScore / (totalDays * this.minutesPerDayRequired));

  next();
});

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


function _normalizeDate(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}


mongoose.model('Season', SeasonSchema);
