const mongoose = require('mongoose');

const emergencyGuaranteeSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Guarantee Details
  type: {
    type: String,
    enum: ['5_min_response', 'on_time_arrival', 'price_match', 'satisfaction'],
    default: '5_min_response'
  },
  guaranteedTime: {
    type: Number, // minutes
    default: 5
  },
  actualTime: {
    type: Number, // minutes
    default: null
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'failed', 'claimed', 'refunded'],
    default: 'active'
  },
  // Refund
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'failed'],
    default: 'none'
  },
  // Claim
  claimedAt: {
    type: Date
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimReason: {
    type: String
  },
  // Admin Review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNote: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Methods
emergencyGuaranteeSchema.methods.isEligible = function() {
  return this.status === 'active' && this.actualTime > this.guaranteedTime;
};

emergencyGuaranteeSchema.methods.getRefundAmount = function() {
  if (this.isEligible()) {
    // Refund = booking fee (₹49)
    return 49;
  }
  return 0;
};

module.exports = mongoose.model('EmergencyGuarantee', emergencyGuaranteeSchema);