const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  facilities: [{
    type: String,
    enum: ['whiteboard', 'projector', 'computer', 'air_conditioning', 'wifi', 'printer']
  }],
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    timeSlots: [{
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Room', roomSchema);