const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');

router.post('/sample', async (req, res) => {
  try {
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '+1234567890'
    });
    await user.save();
    res.status(201).json({ message: 'Sample user created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/:id/notifications
router.get('/:id/notifications', async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
