const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: String,
        default: ''
    },

    address: {
        type: String,
        required: true
    },

    latitude: Number,

    longitude: Number,

    status: {
        type: String,
        enum: ['waiting', 'approved'],
        default: 'waiting'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Waitlist', waitlistSchema);