const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE (Pehle yeh aana chahiye)
// ============================================================
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// DATABASE CONNECTION
// ============================================================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// ============================================================
// ROUTES (Routes yahan aani chahiye)
// ============================================================
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/users', userRoutes);
// After other route imports
const paymentRoutes = require('./routes/payments');
const trackingRoutes = require('./routes/tracking');

// Add routes
app.use('/api/payments', paymentRoutes);
app.use('/api/tracking', trackingRoutes);
// ============================================================
// ROOT & HEALTH ROUTES
// ============================================================
app.get('/', (req, res) => {
  res.json({
    name: 'EmergencyHub API',
    version: '1.0.0',
    status: '🚀 Running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EmergencyHub API is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// 404 & ERROR HANDLING
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 EmergencyHub API running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
// Add these to backend/server.js
const providerRoutes = require('./routes/providers');
const receiptRoutes = require('./routes/receipts');

app.use('/api/providers', providerRoutes);
app.use('/api/receipts', receiptRoutes);
// Add these routes to backend/server.js
const aiRoutes = require('./routes/ai');
const membershipRoutes = require('./routes/membership');

app.use('/api/ai', aiRoutes);
app.use('/api/membership', membershipRoutes);
// Add to server.js
const paymentRoutes = require('./routes/payments');

app.use('/api/payments', paymentRoutes);