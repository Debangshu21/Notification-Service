require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');
const sendEmail = require('./services/emailService');
const sendSMS = require('./services/smsService');

async function retryFailedNotifications(maxRetries = 3) {
    await mongoose.connect(process.env.MONGO_URI);

    const failedNotifications = await Notification.find({
        status: 'failed',
        retryCount: { $lt: maxRetries }
    });

    for (let notification of failedNotifications) {
        try {
            const user = await User.findById(notification.userId);
            if (!user) continue;

            if (notification.type === 'email') {
                await sendEmail(user.email, 'Retry Notification', notification.message);
            } else if (notification.type === 'sms') {
                await sendSMS(user.phone, notification.message);
            }

            notification.status = 'sent';
            notification.error = undefined;
        } catch (err) {
            notification.status = 'failed';
            notification.error = err.message;
        }

        notification.retryCount += 1;
        notification.lastTriedAt = new Date();
        await notification.save();
    }

    console.log(`Processed ${failedNotifications.length} failed notifications.`);
    mongoose.connection.close();
}

retryFailedNotifications();
