const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Day Schema
 */
const DaySchema = new Schema({
  date: {
    type: Number, // 20190922
    required: 'A Day must have a date',
    index: {
      unique: true,
      sparse: true
    }
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


mongoose.model('Day', DaySchema);
