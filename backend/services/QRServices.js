const QRCode = require('qrcode');
const Receipt = require('../models/Receipt');

class QRService {
  // ============================================================
  // GENERATE QR CODE FOR PAYMENT
  // ============================================================
  static async generatePaymentQR(upiId, amount, orderId) {
    try {
      const upiString = `upi://pay?pa=${upiId}&pn=EmergencyHub&am=${amount}&cu=INR&tn=${orderId}`;
      
      // Generate QR code as data URL
      const qrCode = await QRCode.toDataURL(upiString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#0A0F1E',
          light: '#FFFFFF'
        }
      });
      
      return {
        success: true,
        qrCode: qrCode,
        upiString: upiString,
        upiId: upiId,
        amount: amount
      };
    } catch (error) {
      console.error('QR Generation Error:', error);
      return {
        success: false,
        message: 'Failed to generate QR code'
      };
    }
  }

  // ============================================================
  // GENERATE QR CODE FOR RECEIPT
  // ============================================================
  static async generateReceiptQR(receiptId) {
    try {
      const receipt = await Receipt.findById(receiptId);
      if (!receipt) {
        return { success: false, message: 'Receipt not found' };
      }

      const receiptData = {
        receiptNumber: receipt.receiptNumber,
        amount: receipt.totalAmount,
        date: receipt.issuedAt,
        customer: receipt.customerName,
        service: receipt.serviceName
      };

      const qrString = JSON.stringify(receiptData);
      const qrCode = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200
      });

      return {
        success: true,
        qrCode: qrCode,
        receiptNumber: receipt.receiptNumber
      };
    } catch (error) {
      console.error('Receipt QR Error:', error);
      return { success: false, message: 'Failed to generate receipt QR' };
    }
  }

  // ============================================================
  // VERIFY PAYMENT QR
  // ============================================================
  static async verifyPaymentQR(qrData) {
    try {
      // Parse UPI string
      const params = new URLSearchParams(qrData.split('?')[1]);
      const pa = params.get('pa');
      const pn = params.get('pn');
      const am = params.get('am');
      const tn = params.get('tn');

      if (pa && am && tn) {
        return {
          success: true,
          upiId: pa,
          amount: parseFloat(am),
          orderId: tn,
          merchantName: pn || 'EmergencyHub'
        };
      }
      return { success: false, message: 'Invalid QR data' };
    } catch (error) {
      console.error('QR Verification Error:', error);
      return { success: false, message: 'Failed to verify QR' };
    }
  }
}

module.exports = QRService;