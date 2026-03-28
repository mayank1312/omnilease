const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  stripeSessionId: { type: String, required: true },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);