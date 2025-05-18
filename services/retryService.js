const Notification = require('../models/Notification');
const emailService = require('./emailService');
const smsService = require('./smsService');

exports.scheduleRetry = (id, type) => {
  setTimeout(async () => {
    const notification = await Notification.findById(id).populate('userId');
    let success = false;

    if (type === 'email') {
      success = await emailService.send(notification.userId.email, notification.message);
    } else if (type === 'sms') {
      success = await smsService.send(notification.userId.phone, notification.message);
    }

    if (success) {
      notification.status = 'sent';
      await notification.save();
    }
  }, 60000); // retry after 1 minute
};
