const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  serviceCategory: {
    type: String,
    required: true,
    enum: ['mechanic', 'electrician', 'plumber', 'ac_repair', 'locksmith', 'appliance', 'towing', 'carpenter', 'cleaning']
  },
  serviceName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedPrice: {
    min: { type: Number },
    max: { type: Number }
  },
  finalPrice: {
    type: Number,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'cash_on_service', 'card', 'netbanking', 'wallet'],
    default: 'cash_on_service'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: null
  },
  isSOS: {
    type: Boolean,
    default: false
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: { type: String }
  },
  timeline: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);