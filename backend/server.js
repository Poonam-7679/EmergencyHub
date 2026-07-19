const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(helmet());

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://emergency-hub-yril-one.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// DATABASE
// ============================================================

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err.message));

// ============================================================
// IMPORT ROUTES
// ============================================================

const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');
const trackingRoutes = require('./routes/tracking');
const receiptRoutes = require('./routes/receipt');
const aiRoutes = require('./routes/ai');
const membershipRoutes = require('./routes/membership');
const waitlistRoutes = require('./routes/waitlist');
// ============================================================
// REGISTER ROUTES
// ============================================================

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/waitlist', waitlistRoutes); // NEW

// ============================================================
// ROOT
// ============================================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EmergencyHub API',
        version: '1.0.0',
        status: 'Running'
    });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date()
    });
});

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
    console.log(`🚀 EmergencyHub running on port ${PORT}`);
    console.log(`🌍 http://localhost:${PORT}`);
});