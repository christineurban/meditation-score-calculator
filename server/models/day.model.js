const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Day Schema
 */
const DaySchema = new Schema({
  date: {
    type: String, // 2019-09-22
    trim: true,
    required: 'A Day must have a date'
  },
  meditations: [{
    type: Schema.ObjectId,
    ref: 'Meditation'
  }],
  totalMinutes: {
    type: Number,
    default: 0
  },
  season: {
    type: Schema.ObjectId,
    ref: 'Season'
  },
  _userId: {
    type: String,
    trim: true,
    required: 'An Day must belong to an user',
    select: false
  }
});

/**
 * Calculate total minutes before saving
 */
DaySchema.pre('save', function(next) {
  this.totalMinutes = this.meditations.reduce((sum, meditation) => {
    return meditation.minutes + sum;
  }, 0);

  next();
});


mongoose.model('Day', DaySchema);
