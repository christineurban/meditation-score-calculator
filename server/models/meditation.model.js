const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Meditation Schema
 */
const MeditationSchema = new Schema({
  minutes: {
    type: Number,
    required: 'An Meditation must have minutes'
  },
  dateTime: {
    type: Date,
    required: 'An Meditation must have a datetime'
  },
  day: {
    type: Schema.ObjectId,
    ref: 'Day'
  },
  _userId: {
    type: String,
    trim: true,
    required: 'An Meditation must belong to an user',
    select: false
  }
}, {
  timestamps: true
});


mongoose.model('Meditation', MeditationSchema);
