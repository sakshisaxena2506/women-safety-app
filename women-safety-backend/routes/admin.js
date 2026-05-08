// routes/admin.js
// Admin-only operations

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Alert = require('../models/Alert');
const Volunteer = require('../models/Volunteer');
const { protect, restrictTo } = require('../middleware/auth');

// All admin routes are protected + admin only
router.use(protect, restrictTo('admin'));

// GET /api/admin/stats — Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalVolunteers,
      activeAlerts,
      resolvedToday
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'volunteer' }),
      Alert.countDocuments({ status: 'active' }),
      Alert.countDocuments({
        status: 'resolved',
        resolvedAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      })
    ]);

    res.json({ 
      success: true, 
      stats: { totalUsers, totalVolunteers, activeAlerts, resolvedToday }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/users — All users list
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/volunteers — All volunteers list
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, volunteers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/volunteers/:id/verify — Verify a volunteer
router.patch('/volunteers/:id/verify', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, verifiedAt: new Date() },
      { new: true }
    ).populate('user', 'name email');

    res.json({ 
      success: true, 
      message: `${volunteer.user.name} verified as volunteer.`,
      volunteer 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/alerts — All alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('user', 'name phone')
      .populate('assignedVolunteer', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/users/:id/suspend — Suspend a user
router.patch('/users/:id/suspend', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json({ success: true, message: 'User suspended.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;