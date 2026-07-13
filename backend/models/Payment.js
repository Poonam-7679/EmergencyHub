const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  // ============================================================
  // ORDER DETAILS
  // ============================================================
  orderId: {
    type: String,
    required: true,
    unique: true
  },

  // ============================================================
  // PAYMENT DETAILS
  // ============================================================
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cash_on_service'],
    required: true
  },

  // ============================================================
  // UPI PAYMENT DETAILS
  // ============================================================
  upiPayment: {
    upiId: { type: String },
    upiIntent: { type: String },
    transactionId: { type: String },
    customerUpiId: { type: String },
    paymentConfirmed: { type: Boolean, default: false },
    confirmedAt: { type: Date }
  },

  // ============================================================
  // CASH ON SERVICE DETAILS
  // ============================================================
  cashOnService: {
    amountReceived: { type: Number },
    receivedBy: { type: String },
    receiptPhoto: { type: String },
    customerOTP: { type: String },
    otpVerified: { type: Boolean, default: false },
    paymentConfirmedAt: { type: Date }
  },

  // ============================================================
  // FOUNDER UPI (Where money goes for UPI)
  // ============================================================
  // Replace your founderUpi section with this:
founderUpi: {
  upiId: { type: String, default: '9399530604@ybl' },
  accountName: { type: String, default: 'Poonam Sahu' },
  bankName: { type: String, default: 'Punjab National Bank' }
},
  // ============================================================
  // COMMISSION (₹49)
  // ============================================================
  commission: {
    amount: { type: Number, default: 49 },
    deducted: { type: Boolean, default: false },
    deductedAt: { type: Date }
  },

  // ============================================================
  // PROVIDER PAYOUT
  // ============================================================
  providerPayout: {
    amount: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    completedAt: { type: Date }
  },

  // ============================================================
  // STATUS
  // ============================================================
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed', 'failed'],
    default: 'pending'
  },

  paidAt: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

// Methods
paymentSchema.methods.getNetAmount = function() {
  return this.amount - this.commission.amount;
};

paymentSchema.methods.getFounderAmount = function() {
  return this.commission.amount;
};

paymentSchema.methods.getProviderAmount = function() {
  return this.amount - this.commission.amount;
};

module.exports = mongoose.model('Payment', paymentSchema);