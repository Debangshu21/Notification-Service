const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../services/emailService');
const sendSMS = require('../services/smsService');

router.post('/', async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'userId, type, and message are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const notification = new Notification({
      userId,
      type,
      message,
      status: 'pending'
    });

    await notification.save();

    try {
      if (type === 'email') {
        await sendEmail(user.email, 'Notification', message);
      } else if (type === 'sms') {
        await sendSMS(user.phone, message);
      }

      notification.status = 'sent';
    } catch (sendErr) {
      notification.status = 'failed';
      notification.error = sendErr.message;
    }

    await notification.save();

    res.status(201).json({ message: 'Notification processed', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
