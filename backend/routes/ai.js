const express = require('express');
const router = express.Router();
const AIService = require('../services/AIService');
const auth = require('../middleware/auth');

// ============================================================
// 1. TEXT ANALYSIS
// ============================================================
router.post('/analyze/text', auth, async (req, res) => {
  try {
    const { text, bookingId } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text input required'
      });
    }

    const result = await AIService.analyzeText(text, userId, bookingId);
    res.json(result);

  } catch (error) {
    console.error('AI analyze text error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed'
    });
  }
});

// ============================================================
// 2. IMAGE ANALYSIS
// ============================================================
router.post('/analyze/image', auth, async (req, res) => {
  try {
    const { imageUrl, bookingId } = req.body;
    const userId = req.user.id;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL required'
      });
    }

    const result = await AIService.analyzeImage(imageUrl, userId, bookingId);
    res.json(result);

  } catch (error) {
    console.error('AI analyze image error:', error);
    res.status(500).json({
      success: false,
      message: 'Image analysis failed'
    });
  }
});

// ============================================================
// 3. GET ANALYSIS HISTORY
// ============================================================
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;
    const result = await AIService.getAnalysisHistory(userId, limit);
    res.json(result);

  } catch (error) {
    console.error('Get AI history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get history'
    });
  }
});

// ============================================================
// 4. RATE AI RESPONSE
// ============================================================
router.post('/rate/:analysisId', auth, async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { rating, helpful, comment } = req.body;
    const userId = req.user.id;

    const result = await AIService.rateAIResponse(analysisId, userId, rating, helpful, comment);
    res.json(result);

  } catch (error) {
    console.error('Rate AI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

module.exports = router;