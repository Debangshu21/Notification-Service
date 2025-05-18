const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['email', 'sms'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], required: true },
  error: { type: String },
  retryCount: { type: Number, default: 0 },
  lastTriedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
