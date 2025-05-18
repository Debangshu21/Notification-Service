const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const retryService = require('../services/retryService');

exports.sendNotification = async (req, res) => {
  const { userId, type, message } = req.body;
  try {
    const user = await User.findById(userId);
    let status = 'sent';

    if (type === 'email') {
      const success = await emailService.send(user.email, message);
      if (!success) status = 'failed';
    } else if (type === 'sms') {
      const success = await smsService.send(user.phone, message);
      if (!success) status = 'failed';
    }

    const notification = await Notification.create({ userId, type, message, status });

    if (status === 'failed') retryService.scheduleRetry(notification._id, type);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.id });
  res.status(200).json(notifications);
};