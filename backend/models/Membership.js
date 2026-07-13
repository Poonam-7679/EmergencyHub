const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'plus', 'family', 'business'],
    default: 'free'
  },
  // Plan Details
  planName: {
    type: String,
    default: 'Free'
  },
  price: {
    type: Number,
    default: 0
  },
  // Benefits
  benefits: {
    priorityDispatch: { type: Boolean, default: false },
    freeInspections: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    familyMembers: { type: Number, default: 0 },
    annualMaintenance: { type: Boolean, default: false },
    sosPriority: { type: Boolean, default: false },
    exclusiveAccess: { type: Boolean, default: false }
  },
  // Family Members (for Family plan)
  familyMembers: [{
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String }
  }],
  // Billing
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Static plans
membershipSchema.statics.PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    benefits: {
      priorityDispatch: false,
      freeInspections: 0,
      discountPercentage: 0,
      familyMembers: 0,
      annualMaintenance: false,
      sosPriority: false,
      exclusiveAccess: false
    }
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    price: 299,
    benefits: {
      priorityDispatch: true,
      freeInspections: 2,
      discountPercentage: 10,
      familyMembers: 1,
      annualMaintenance: false,
      sosPriority: true,
      exclusiveAccess: false
    }
  },
  family: {
    id: 'family',
    name: 'Family',
    price: 499,
    benefits: {
      priorityDispatch: true,
      freeInspections: 4,
      discountPercentage: 15,
      familyMembers: 4,
      annualMaintenance: true,
      sosPriority: true,
      exclusiveAccess: true
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 999,
    benefits: {
      priorityDispatch: true,
      freeInspections: 10,
      discountPercentage: 20,
      familyMembers: 10,
      annualMaintenance: true,
      sosPriority: true,
      exclusiveAccess: true
    }
  }
};

// Methods
membershipSchema.methods.isExpired = function() {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
};

membershipSchema.methods.getRemainingDays = function() {
  if (!this.endDate) return 0;
  const diff = this.endDate - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

membershipSchema.methods.canAddFamilyMember = function() {
  return this.familyMembers.length < this.benefits.familyMembers;
};

module.exports = mongoose.model('Membership', membershipSchema);