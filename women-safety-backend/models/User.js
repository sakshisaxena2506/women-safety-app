// models/User.js
// Defines what a User looks like in our database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password in queries
  },
  role: {
    type: String,
    enum: ['user', 'volunteer', 'admin'],
    default: 'user'
  },
  emergencyContacts: [EmergencyContactSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);