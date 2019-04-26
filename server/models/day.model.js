const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Day Schema
 */
const DaySchema = new Schema({
  date: {
    type: Date
  },
  meditations: [{
    type: Schema.ObjectId,
    ref: 'Meditation'
  }],
  totalMinutes: {
    type: Number,
    default: 0
  },
  _userId: {
    type: String,
    trim: true,
    required: 'An Day must belong to an user',
    select: false
  }
}, {
  timestamps: true
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
