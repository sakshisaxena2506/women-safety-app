// models/Alert.js
// Defines what an Emergency Alert looks like in our database

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String }
});

const AlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: LocationSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'assigned', 'resolved', 'cancelled'],
    default: 'active'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  description: {
    type: String,
    default: 'SOS Emergency Alert'
  },
  resolvedAt: {
    type: Date
  },
  responseTime: {
    type: Number // in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);