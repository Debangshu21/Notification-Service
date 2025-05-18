
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const Notification = require('./models/Notification');
const sendEmail = require('./services/emailService');
const sendSMS = require('./services/smsService');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

app.use('/notifications', notificationRoutes);
app.use('/users', userRoutes);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Dashboard Home - List users
app.get('/dashboard', async (req, res) => {
  const users = await User.find();
  res.render('dashboard', { users });
});

// View notifications per user
app.get('/dashboard/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  const notifications = await Notification.find({ userId: req.params.id }).sort({ createdAt: -1 });
  res.render('user', { user, notifications });
});

// View failed notifications
app.get('/dashboard/failed', async (req, res) => {
  const notifications = await Notification.find({ status: 'failed' });
  res.render('failed', { notifications });
});

// Retry a failed notification
app.post('/dashboard/retry/:id', async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  const user = await User.findById(notification.userId);

  try {
    if (notification.type === 'email') {
      await sendEmail(user.email, 'Notification Retry', notification.message);
    } else if (notification.type === 'sms') {
      await sendSMS(user.phone, notification.message);
    }

    notification.status = 'sent';
    notification.error = null;
  } catch (err) {
    notification.retryCount = (notification.retryCount || 0) + 1;
    notification.error = err.message;
  }

  await notification.save();
  res.redirect('/dashboard/failed');
});

// Handle creating a new user
app.post('/dashboard/create-user', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newUser = new User({ name, email, phone });
    await newUser.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error creating user: ' + err.message);
  }
});

// Handle sending a notification to a user
app.post('/dashboard/send-notification', async (req, res) => {
  const { userId, type, message } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const notification = new Notification({ userId, type, message, status: 'pending' });
    await notification.save();

    try {
      if (type === 'email') {
        await sendEmail(user.email, 'Notification', message);
      } else if (type === 'sms') {
        await sendSMS(user.phone, message);
      }
      notification.status = 'sent';
    } catch (err) {
      notification.status = 'failed';
      notification.error = err.message;
    }

    await notification.save();
    res.redirect('/dashboard/user/' + userId);
  } catch (err) {
    res.status(500).send('Error sending notification: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('Notification Service is up!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
