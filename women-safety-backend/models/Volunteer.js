// models/Volunteer.js
// Extra details for Volunteer role users

const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    type: String // e.g., "First Aid", "Self Defense Training"
  }],
  areaOfOperation: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  totalResponseCount: {
    type: Number,
    default: 0
  },
  successfulResponses: {
    type: Number,
    default: 0
  },
  currentLocation: {
    latitude: Number,
    longitude: Number
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);