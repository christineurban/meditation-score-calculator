const mongoose = require('mongoose');

const Schema = mongoose.Schema;


/**
 * Quarter Schema
 */
const QuarterSchema = new Schema({
  name: {
    type: String,
    trim: true,
    enum: ['Spring Equinox', 'Summer Solstice', 'Fall Equinox', 'Winter Solstice'],
    required: 'Please provide the name of this Quarter'
  },
  start: {
    type: Date
  },
  end: {
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
    required: 'An Quarter must belong to an user',
    select: false
  }
}, {
  timestamps: true
});

/**
 * Calculate meditation score before saving
 */
QuarterSchema.pre('save', function(next) {
  const totalDays = (_normalizeDate(new Date()) - _normalizeDate(this.start)) / (60 * 60 * 24 * 1000) + 1;
  const subScore = this.days.reduce((accum, day) => {
    return day.totalMinutes + accum;
  }, 0);

  this.score = Math.round(subScore / (totalDays * this.minutesPerDayRequired));

  next();
});

function _normalizeDate(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}


mongoose.model('Quarter', QuarterSchema);
