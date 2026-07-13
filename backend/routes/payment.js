const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// ============================================================
// 1. GENERATE UPI PAYMENT
// ============================================================
router.post('/upi/generate', auth, async (req, res) => {
  try {
    const { bookingId, amount = 499 } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // REAL FOUNDER UPI
    const upiId = process.env.FOUNDER_UPI_ID || 'emergencyhub@hdfc';
    const orderId = `UPI_${Date.now()}_${bookingId.slice(-6)}`;

    // UPI Intent — Money goes to FOUNDER UPI
    const upiIntent = `upi://pay?pa=${upiId}&pn=EmergencyHub&am=${amount}&cu=INR&tn=Payment%20for%20booking%20${bookingId}`;

    // Save payment
    const payment = new Payment({
      user: userId,
      booking: bookingId,
      orderId: orderId,
      amount: amount,
      currency: 'INR',
      paymentMethod: 'upi',
      status: 'pending',
      upiPayment: {
        upiId: upiId,
        upiIntent: upiIntent,
        paymentConfirmed: false
      },
      founderUpi: {
        upiId: upiId,
        accountName: process.env.FOUNDER_ACCOUNT_NAME || 'EmergencyHub Private Limited',
        bankName: process.env.FOUNDER_BANK_NAME || 'HDFC Bank'
      },
      commission: {
        amount: 49,
        deducted: false
      },
      providerPayout: {
        amount: amount - 49,
        status: 'pending'
      }
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        orderId: orderId,
        upiIntent: upiIntent,
        upiId: upiId,
        amount: amount,
        bookingId: bookingId,
        commission: 49,
        founderUpi: {
          upiId: upiId,
          accountName: process.env.FOUNDER_ACCOUNT_NAME,
          bankName: process.env.FOUNDER_BANK_NAME
        }
      }
    });

  } catch (error) {
    console.error('UPI generate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate UPI payment'
    });
  }
});

// ============================================================
// 2. VERIFY UPI PAYMENT (Admin/User)
// ============================================================
router.post('/upi/verify', auth, async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;
    const userId = req.user.id;

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify ownership
    if (payment.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update payment
    payment.status = 'verified';
    payment.paidAt = new Date();
    payment.upiPayment.transactionId = transactionId || `UPI_${Date.now()}`;
    payment.upiPayment.paymentConfirmed = true;
    payment.upiPayment.confirmedAt = new Date();

    // Deduct commission
    payment.commission.deducted = true;
    payment.commission.deductedAt = new Date();

    // Provider payout pending
    payment.providerPayout.status = 'pending';

    await payment.save();

    // Update booking
    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: 'paid',
      paymentId: payment.upiPayment.transactionId,
      status: 'completed'
    });

    // Generate receipt
    const booking = await Booking.findById(payment.booking).populate('user');
    const receipt = new Receipt({
      bookingId: payment.booking,
      userId: payment.user,
      receiptNumber: `RCP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      serviceName: booking.serviceName,
      amount: payment.amount,
      platformFee: payment.commission.amount,
      totalAmount: payment.amount,
      paymentMethod: 'upi',
      paymentId: payment.upiPayment.transactionId,
      customerName: booking.customerName,
      customerEmail: booking.user?.email || '',
      customerPhone: booking.customerPhone || '',
      providerName: booking.provider?.name || 'EmergencyHub',
      commission: {
        amount: payment.commission.amount,
        deducted: true,
        deductedAt: new Date()
      },
      status: 'paid',
      issuedAt: new Date()
    });

    await receipt.save();

    console.log(`💰 UPI Payment ₹${payment.amount} verified. Commission ₹${payment.commission.amount} to Founder UPI: ${process.env.FOUNDER_UPI_ID}`);

    res.json({
      success: true,
      message: 'UPI payment verified successfully',
      data: {
        orderId: payment.orderId,
        amount: payment.amount,
        commission: payment.commission.amount,
        netAmount: payment.getNetAmount(),
        founderUpi: payment.founderUpi,
        receipt: receipt
      }
    });

  } catch (error) {
    console.error('Verify UPI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify UPI payment'
    });
  }
});

// ============================================================
// 3. GENERATE CASH ON SERVICE OTP
// ============================================================
router.post('/cash/generate-otp', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create payment record
    const orderId = `CASH_${Date.now()}_${bookingId.slice(-6)}`;
    
    const payment = new Payment({
      user: userId,
      booking: bookingId,
      orderId: orderId,
      amount: 499,
      currency: 'INR',
      paymentMethod: 'cash_on_service',
      status: 'pending',
      cashOnService: {
        customerOTP: otp,
        otpVerified: false
      },
      commission: {
        amount: 49,
        deducted: false
      },
      providerPayout: {
        amount: 450,
        status: 'pending'
      }
    });

    await payment.save();

    // Save OTP to booking
    booking.cashOnService = {
      customerOTP: otp,
      otpVerified: false
    };
    await booking.save();

    res.json({
      success: true,
      message: 'OTP generated successfully',
      data: {
        orderId: orderId,
        otp: otp, // In production, send via SMS
        bookingId: bookingId
      }
    });

  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate OTP'
    });
  }
});

// ============================================================
// 4. VERIFY CASH ON SERVICE (With OTP)
// ============================================================
router.post('/cash/verify', auth, async (req, res) => {
  try {
    const { orderId, otp, amountReceived } = req.body;
    const userId = req.user.id;

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify ownership
    if (payment.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify OTP
    if (payment.cashOnService.customerOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (payment.cashOnService.otpVerified) {
      return res.status(400).json({
        success: false,
        message: 'OTP already verified'
      });
    }

    // Update payment
    payment.status = 'completed';
    payment.paidAt = new Date();
    payment.cashOnService.otpVerified = true;
    payment.cashOnService.amountReceived = amountReceived || 499;
    payment.cashOnService.paymentConfirmedAt = new Date();

    // Deduct commission
    payment.commission.deducted = true;
    payment.commission.deductedAt = new Date();

    // Provider payout completed (Cash already with provider)
    payment.providerPayout.status = 'completed';
    payment.providerPayout.completedAt = new Date();

    await payment.save();

    // Update booking
    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: 'paid',
      status: 'completed',
      'cashOnService.otpVerified': true,
      'cashOnService.paymentConfirmedAt': new Date()
    });

    // Generate receipt
    const booking = await Booking.findById(payment.booking).populate('user');
    const receipt = new Receipt({
      bookingId: payment.booking,
      userId: payment.user,
      receiptNumber: `RCP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      serviceName: booking.serviceName,
      amount: payment.amount,
      platformFee: payment.commission.amount,
      totalAmount: payment.amount,
      paymentMethod: 'cash_on_service',
      paymentId: `CASH_${Date.now()}`,
      customerName: booking.customerName,
      customerEmail: booking.user?.email || '',
      customerPhone: booking.customerPhone || '',
      providerName: booking.provider?.name || 'EmergencyHub',
      commission: {
        amount: payment.commission.amount,
        deducted: true,
        deductedAt: new Date()
      },
      status: 'paid',
      issuedAt: new Date()
    });

    await receipt.save();

    console.log(`💰 Cash Payment ₹${payment.amount} verified. Commission ₹${payment.commission.amount} due to EmergencyHub`);

    res.json({
      success: true,
      message: 'Cash payment verified successfully',
      data: {
        orderId: payment.orderId,
        amount: payment.amount,
        commission: payment.commission.amount,
        receipt: receipt
      }
    });

  } catch (error) {
    console.error('Verify cash error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify cash payment'
    });
  }
});

// ============================================================
// 5. GET PAYMENT HISTORY
// ============================================================
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId })
      .populate('booking', 'serviceName status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments.map(p => ({
        id: p._id,
        orderId: p.orderId,
        amount: p.amount,
        commission: p.commission.amount,
        netAmount: p.getNetAmount(),
        paymentMethod: p.paymentMethod,
        status: p.status,
        paidAt: p.paidAt,
        founderUpi: p.founderUpi,
        booking: p.booking
      }))
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
});

// ============================================================
// 6. ADMIN — GET ALL PAYMENTS
// ============================================================
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('booking', 'serviceName')
      .sort({ createdAt: -1 });

    const stats = {
      totalRevenue: payments.reduce((sum, p) => sum + (p.status === 'verified' || p.status === 'completed' ? p.amount : 0), 0),
      totalCommission: payments.reduce((sum, p) => sum + (p.status === 'verified' || p.status === 'completed' ? p.commission.amount : 0), 0),
      totalPayments: payments.length,
      upiPayments: payments.filter(p => p.paymentMethod === 'upi').length,
      cashPayments: payments.filter(p => p.paymentMethod === 'cash_on_service').length
    };

    res.json({
      success: true,
      data: { payments, stats }
    });

  } catch (error) {
    console.error('Admin payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
});

module.exports = router;