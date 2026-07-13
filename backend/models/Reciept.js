const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  // ============================================================
  // RECEIPT IDENTIFIERS
  // ============================================================
  receiptNumber: {
    type: String,
    unique: true,
    required: true
  },

  // ============================================================
  // BOOKING & USER REFERENCES
  // ============================================================
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
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ============================================================
  // SERVICE DETAILS
  // ============================================================
  serviceName: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: String,
    required: true
  },
  serviceDescription: {
    type: String,
    default: ''
  },

  // ============================================================
  // PAYMENT DETAILS
  // ============================================================
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 49
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'cash_on_service', 'card', 'netbanking', 'wallet'],
    required: true
  },
  paymentId: {
    type: String
  },
  transactionId: {
    type: String
  },

  // ============================================================
  // CUSTOMER DETAILS
  // ============================================================
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String
  },

  // ============================================================
  // PROVIDER DETAILS
  // ============================================================
  providerName: {
    type: String,
    required: true
  },
  providerPhone: {
    type: String
  },
  providerGST: {
    type: String
  },

  // ============================================================
  // COMMISSION & PAYOUT
  // ============================================================
  commission: {
    amount: { type: Number, default: 49 },
    deducted: { type: Boolean, default: false },
    deductedAt: { type: Date }
  },
  providerPayout: {
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' }
  },

  // ============================================================
  // WARRANTY
  // ============================================================
  warrantyDays: {
    type: Number,
    default: 30
  },
  warrantyExpiry: {
    type: Date
  },

  // ============================================================
  // QR CODE & FILES
  // ============================================================
  qrCode: {
    type: String
  },
  pdfUrl: {
    type: String
  },

  // ============================================================
  // STATUS
  // ============================================================
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // ============================================================
  // NOTES
  // ============================================================
  notes: {
    type: String,
    default: ''
  },

  issuedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

// ============================================================
// Generate receipt number before save
// ============================================================
receiptSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.receiptNumber = `RCP-${year}${month}${day}-${random}`;
  }

  if (!this.warrantyExpiry && this.warrantyDays) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.warrantyDays);
    this.warrantyExpiry = expiry;
  }

  next();
});

// ============================================================
// Methods
// ============================================================
receiptSchema.methods.getNetAmount = function() {
  return this.totalAmount - this.platformFee;
};

receiptSchema.methods.isWarrantyValid = function() {
  if (!this.warrantyExpiry) return false;
  return new Date() < this.warrantyExpiry;
};

receiptSchema.methods.getRemainingWarrantyDays = function() {
  if (!this.warrantyExpiry) return 0;
  const diff = this.warrantyExpiry - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

module.exports = mongoose.model('Receipt', receiptSchema);