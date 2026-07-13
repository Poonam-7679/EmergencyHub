const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  // Input
  inputType: {
    type: String,
    enum: ['text', 'voice', 'image', 'video'],
    required: true
  },
  inputText: {
    type: String
  },
  inputMediaUrl: {
    type: String
  },
  // AI Analysis
  analysis: {
    issue: { type: String },
    category: { type: String },
    confidence: { type: Number, min: 0, max: 100 },
    probableCauses: [{
      cause: { type: String },
      percentage: { type: Number }
    }]
  },
  // Price Estimate
  priceEstimate: {
    min: { type: Number },
    max: { type: Number },
    breakdown: {
      serviceCharge: { type: Number },
      parts: { type: Number },
      travelFee: { type: Number },
      emergencyCharge: { type: Number }
    }
  },
  // Urgency
  urgency: {
    level: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    reason: { type: String },
    isSafeToDrive: { type: Boolean },
    recommendation: { type: String }
  },
  // Professional needed
  professionalNeeded: {
    category: { type: String },
    specialty: { type: String },
    experienceRequired: { type: Number }
  },
  // Follow-up questions
  followUpQuestions: [String],
  // Response
  aiResponse: {
    type: String
  },
  // Status
  isReviewed: {
    type: Boolean,
    default: false
  },
  userFeedback: {
    helpful: { type: Boolean },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIAnalysis', aiAnalysisSchema);