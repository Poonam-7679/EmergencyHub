const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    enum: ['mechanic', 'electrician', 'plumber', 'ac_repair', 'locksmith', 'appliance', 'towing', 'carpenter', 'cleaning']
  }],
  experience: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  // ============================================================
  // DOCUMENT VERIFICATION
  // ============================================================
  documents: {
    aadhaar: {
      number: { type: String },
      fileUrl: { type: String },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    },
    pan: {
      number: { type: String },
      fileUrl: { type: String },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    },
    license: {
      number: { type: String },
      fileUrl: { type: String },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    },
    tradeCertificate: {
      number: { type: String },
      fileUrl: { type: String },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    },
    profilePhoto: {
      fileUrl: { type: String },
      verified: { type: Boolean, default: false }
    }
  },
  // ============================================================
  // VERIFICATION STATUS
  // ============================================================
  verificationStatus: {
    type: String,
    enum: ['pending', 'in_review', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationNote: {
    type: String,
    default: ''
  },
  // ============================================================
  // RATINGS & PERFORMANCE
  // ============================================================
  rating: {
    type: Number,
    default: 0
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  onTimeRate: {
    type: Number,
    default: 0
  },
  responseRate: {
    type: Number,
    default: 0
  },
  cancellationRate: {
    type: Number,
    default: 0
  },
  // ============================================================
  // AVAILABILITY
  // ============================================================
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: false },
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '21:00' }
  },
  // ============================================================
  // WALLET
  // ============================================================
  wallet: {
    balance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    pendingWithdrawal: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
providerSchema.index({ userId: 1 });
providerSchema.index({ verificationStatus: 1 });
providerSchema.index({ city: 1 });
providerSchema.index({ services: 1 });

// Methods
providerSchema.methods.isFullyVerified = function() {
  return this.verificationStatus === 'verified' &&
         this.documents.aadhaar.verified &&
         this.documents.pan.verified &&
         this.documents.license.verified;
};

providerSchema.methods.getVerificationProgress = function() {
  const docs = ['aadhaar', 'pan', 'license', 'tradeCertificate'];
  const verified = docs.filter(d => this.documents[d].verified).length;
  return Math.round((verified / docs.length) * 100);
};

module.exports = mongoose.model('Provider', providerSchema);