const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const Booking = require('../models/Booking');
const User = require('../models/User');
const QRCode = require('qrcode');
const { auth, admin } = require('../middleware/auth');
// ============================================================
// 1. GENERATE RECEIPT (After Payment)
// ============================================================
router.post('/generate', auth, async (req, res) => {
  try {
    const {
      bookingId,
      serviceName,
      serviceCategory,
      serviceDescription,
      amount,
      platformFee,
      tax,
      paymentMethod,
      paymentId,
      transactionId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      providerName,
      providerPhone,
      providerGST,
      warrantyDays
    } = req.body;

    const userId = req.user.id;

    // Get booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Get provider details
    const provider = await User.findById(booking.providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    const totalAmount = amount + (platformFee || 49) + (tax || 0);

    // Create receipt
    const receipt = new Receipt({
      bookingId,
      userId,
      providerId: booking.providerId,
      serviceName: serviceName || booking.serviceName,
      serviceCategory: serviceCategory || booking.serviceCategory,
      serviceDescription: serviceDescription || booking.description || '',
      amount: amount || booking.finalPrice || 499,
      platformFee: platformFee || 49,
      tax: tax || 0,
      totalAmount,
      paymentMethod: paymentMethod || booking.paymentMethod || 'upi',
      paymentId: paymentId || '',
      transactionId: transactionId || '',
      customerName: customerName || booking.customerName || req.user.name,
      customerEmail: customerEmail || req.user.email,
      customerPhone: customerPhone || booking.customerPhone || req.user.phone || '',
      customerAddress: customerAddress || booking.location?.address || '',
      providerName: providerName || provider.name,
      providerPhone: providerPhone || provider.phone || '',
      providerGST: providerGST || '',
      commission: {
        amount: platformFee || 49,
        deducted: true,
        deductedAt: new Date()
      },
      providerPayout: {
        amount: totalAmount - (platformFee || 49),
        status: 'pending'
      },
      warrantyDays: warrantyDays || 30,
      status: 'paid',
      issuedAt: new Date()
    });

    await receipt.save();

    // Generate QR code for receipt
    try {
      const qrData = JSON.stringify({
        receiptNumber: receipt.receiptNumber,
        amount: receipt.totalAmount,
        date: receipt.issuedAt,
        customer: receipt.customerName,
        service: receipt.serviceName
      });
      const qrCode = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200
      });
      receipt.qrCode = qrCode;
      await receipt.save();
    } catch (error) {
      console.log('QR generation skipped:', error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Receipt generated successfully',
      data: receipt
    });

  } catch (error) {
    console.error('Generate receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: error.message
    });
  }
});

// ============================================================
// 2. GET USER RECEIPTS (User Side)
// ============================================================
router.get('/my-receipts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    const receipts = await Receipt.find({ userId })
      .populate('providerId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const stats = {
      total: await Receipt.countDocuments({ userId }),
      totalSpent: await Receipt.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      activeWarranties: await Receipt.countDocuments({
        userId,
        warrantyExpiry: { $gt: new Date() }
      })
    };

    res.json({
      success: true,
      data: {
        receipts,
        stats: {
          total: stats.total,
          totalSpent: stats.totalSpent[0]?.total || 0,
          activeWarranties: stats.activeWarranties
        }
      }
    });

  } catch (error) {
    console.error('Get user receipts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipts'
    });
  }
});

// ============================================================
// 3. GET RECEIPT BY ID (User/Admin)
// ============================================================
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const receipt = await Receipt.findById(id)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name phone');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    // Check authorization
    if (receipt.userId._id.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipt'
    });
  }
});

// ============================================================
// 4. GET RECEIPT BY RECEIPT NUMBER
// ============================================================
router.get('/number/:receiptNumber', auth, async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const userId = req.user.id;

    const receipt = await Receipt.findOne({ receiptNumber })
      .populate('userId', 'name email phone')
      .populate('providerId', 'name phone');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    if (receipt.userId._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Get receipt by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipt'
    });
  }
});

// ============================================================
// 5. GET ALL RECEIPTS (Admin Only)
// ============================================================
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const { limit = 100, status, paymentMethod, startDate, endDate } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (paymentMethod && paymentMethod !== 'all') query.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const receipts = await Receipt.find(query)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Calculate totals
    const totalRevenue = await Receipt.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalCommission = await Receipt.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$platformFee' } } }
    ]);

    const stats = {
      total: await Receipt.countDocuments(),
      paid: await Receipt.countDocuments({ status: 'paid' }),
      pending: await Receipt.countDocuments({ status: 'pending' }),
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCommission: totalCommission[0]?.total || 0,
      totalPayout: (totalRevenue[0]?.total || 0) - (totalCommission[0]?.total || 0)
    };

    res.json({
      success: true,
      data: {
        receipts,
        stats
      }
    });

  } catch (error) {
    console.error('Admin receipts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipts'
    });
  }
});

// ============================================================
// 6. DOWNLOAD RECEIPT (Generate text/PDF)
// ============================================================
router.get('/download/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    // Check authorization
    if (receipt.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const content = `
============================================
            EMERGENCYHUB RECEIPT
============================================

Receipt Number : ${receipt.receiptNumber}
Date           : ${new Date(receipt.issuedAt).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

--------------------------------------------
SERVICE DETAILS
--------------------------------------------
Service        : ${receipt.serviceName}
Category       : ${receipt.serviceCategory}
Description    : ${receipt.serviceDescription || 'N/A'}

--------------------------------------------
PAYMENT DETAILS
--------------------------------------------
Amount         : ₹${receipt.amount}
Platform Fee   : ₹${receipt.platformFee}
Tax            : ₹${receipt.tax || 0}
--------------------------------------------
TOTAL          : ₹${receipt.totalAmount}
--------------------------------------------
Payment Method : ${receipt.paymentMethod}
Status         : ✅ ${receipt.status.toUpperCase()}
Transaction ID : ${receipt.transactionId || 'N/A'}

--------------------------------------------
CUSTOMER DETAILS
--------------------------------------------
Name           : ${receipt.customerName}
Email          : ${receipt.customerEmail}
Phone          : ${receipt.customerPhone || 'N/A'}

--------------------------------------------
PROVIDER DETAILS
--------------------------------------------
Name           : ${receipt.providerName}
Phone          : ${receipt.providerPhone || 'N/A'}

--------------------------------------------
WARRANTY
--------------------------------------------
Warranty       : ${receipt.warrantyDays} days
Expiry         : ${receipt.warrantyExpiry ? new Date(receipt.warrantyExpiry).toLocaleDateString() : 'N/A'}
Status         : ${receipt.isWarrantyValid() ? '✅ Active' : '❌ Expired'}

--------------------------------------------
Thank you for choosing EmergencyHub!
Help is just 1 tap away.
============================================
    `;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${receipt.receiptNumber}.txt`);
    res.send(content);

  } catch (error) {
    console.error('Download receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download receipt'
    });
  }
});

// ============================================================
// 7. REFUND RECEIPT (Admin Only)
// ============================================================
router.post('/refund/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const receipt = await Receipt.findById(id);
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    if (receipt.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Already refunded'
      });
    }

    receipt.status = 'refunded';
    receipt.notes = reason || 'Refund requested';
    await receipt.save();

    res.json({
      success: true,
      message: 'Receipt refunded successfully',
      data: receipt
    });

  } catch (error) {
    console.error('Refund receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refund receipt'
    });
  }
});

module.exports = router;