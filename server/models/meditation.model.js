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
  time: {
    type: Number, // 1330
    required: 'An Meditation must have a time'
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
