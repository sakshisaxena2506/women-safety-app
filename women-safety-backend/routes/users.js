// routes/users.js
// User profile and emergency contacts management

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/profile — Update profile info
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, profileComplete: true },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/emergency-contacts — Add emergency contact
router.post('/emergency-contacts', protect, async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    const user = await User.findById(req.user._id);

    // Max 5 emergency contacts allowed
    if (user.emergencyContacts.length >= 5) {
      return res.status(400).json({ 
        message: 'Maximum 5 emergency contacts allowed.' 
      });
    }

    user.emergencyContacts.push({ name, phone, relationship });
    await user.save();

    res.json({ 
      success: true, 
      message: 'Emergency contact added.',
      contacts: user.emergencyContacts 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/users/emergency-contacts/:contactId
router.delete('/emergency-contacts/:contactId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.emergencyContacts = user.emergencyContacts.filter(
      c => c._id.toString() !== req.params.contactId
    );
    await user.save();

    res.json({ 
      success: true, 
      message: 'Contact removed.',
      contacts: user.emergencyContacts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;