const AIAnalysis = require('../models/AIAnalysis');

class AIService {
  // ============================================================
  // 1. TEXT ANALYSIS (NLP)
  // ============================================================
  static async analyzeText(userInput, userId, bookingId = null) {
    try {
      // Simulate AI processing
      const analysis = await this.processTextInput(userInput);
      
      // Save analysis
      const aiAnalysis = new AIAnalysis({
        userId,
        bookingId,
        inputType: 'text',
        inputText: userInput,
        analysis: analysis.analysis,
        priceEstimate: analysis.priceEstimate,
        urgency: analysis.urgency,
        professionalNeeded: analysis.professionalNeeded,
        followUpQuestions: analysis.followUpQuestions,
        aiResponse: analysis.response,
        createdAt: new Date()
      });
      
      await aiAnalysis.save();
      
      return {
        success: true,
        data: {
          id: aiAnalysis._id,
          response: analysis.response,
          analysis: analysis.analysis,
          priceEstimate: analysis.priceEstimate,
          urgency: analysis.urgency,
          professionalNeeded: analysis.professionalNeeded,
          followUpQuestions: analysis.followUpQuestions
        }
      };
      
    } catch (error) {
      console.error('AI Text Analysis Error:', error);
      return {
        success: false,
        message: 'AI analysis failed'
      };
    }
  }

  // ============================================================
  // 2. IMAGE ANALYSIS (Vision API)
  // ============================================================
  static async analyzeImage(imageUrl, userId, bookingId = null) {
    try {
      // Simulate image analysis
      const analysis = await this.processImageInput(imageUrl);
      
      const aiAnalysis = new AIAnalysis({
        userId,
        bookingId,
        inputType: 'image',
        inputMediaUrl: imageUrl,
        analysis: analysis.analysis,
        priceEstimate: analysis.priceEstimate,
        urgency: analysis.urgency,
        professionalNeeded: analysis.professionalNeeded,
        aiResponse: analysis.response,
        createdAt: new Date()
      });
      
      await aiAnalysis.save();
      
      return {
        success: true,
        data: {
          id: aiAnalysis._id,
          response: analysis.response,
          analysis: analysis.analysis,
          priceEstimate: analysis.priceEstimate,
          urgency: analysis.urgency,
          professionalNeeded: analysis.professionalNeeded
        }
      };
      
    } catch (error) {
      console.error('AI Image Analysis Error:', error);
      return {
        success: false,
        message: 'Image analysis failed'
      };
    }
  }

  // ============================================================
  // 3. PROCESS TEXT INPUT
  // ============================================================
  static async processTextInput(input) {
    const lowerInput = input.toLowerCase();
    
    // Detect issue category
    let category = 'general';
    let issue = 'Unknown issue';
    let probableCauses = [];
    let response = '';
    let priceEstimate = { min: 0, max: 0, breakdown: {} };
    let urgency = { level: 'medium', reason: '', isSafeToDrive: true };
    let professionalNeeded = { category: 'general', specialty: 'General' };
    let followUpQuestions = [];

    // Bike/Car issues
    if (lowerInput.includes('bike') || lowerInput.includes('car') || lowerInput.includes('vehicle')) {
      category = 'vehicle';
      issue = 'Vehicle breakdown';
      
      if (lowerInput.includes('start') || lowerInput.includes('starting') || lowerInput.includes('battery')) {
        issue = 'Vehicle not starting';
        probableCauses = [
          { cause: 'Dead battery', percentage: 70 },
          { cause: 'Spark plug issue', percentage: 20 },
          { cause: 'Fuel blockage', percentage: 10 }
        ];
        priceEstimate = {
          min: 300,
          max: 700,
          breakdown: {
            serviceCharge: 200,
            parts: 150,
            travelFee: 100,
            emergencyCharge: 50
          }
        };
        urgency = {
          level: 'high',
          reason: 'Vehicle cannot start',
          isSafeToDrive: false
        };
        professionalNeeded = {
          category: 'mechanic',
          specialty: 'Battery & Electrical',
          experienceRequired: 3
        };
        followUpQuestions = [
          'Is the self-start working?',
          'Are the headlights turning on?',
          'Do you hear a clicking sound?',
          'When was the last service done?'
        ];
        response = "🔧 **Vehicle Not Starting**\n\nI've analyzed your issue. Here's what I found:\n\n**Likely Issue:** Dead battery (70% probability)\n\n**Estimated Cost:** ₹300 – ₹700\n\n**Urgency:** High — Please avoid trying to start repeatedly.\n\n**Recommendation:** You need a mechanic with battery expertise.\n\nI've sent a request to nearby mechanics. They'll reach out within 5 minutes!";
      }
    }
    
    // Plumbing issues
    else if (lowerInput.includes('pipe') || lowerInput.includes('water') || lowerInput.includes('leak')) {
      category = 'plumbing';
      issue = 'Water leak';
      probableCauses = [
        { cause: 'Pipe burst', percentage: 60 },
        { cause: 'Joint leakage', percentage: 30 },
        { cause: 'Valve issue', percentage: 10 }
      ];
      priceEstimate = {
        min: 350,
        max: 800,
        breakdown: {
          serviceCharge: 250,
          parts: 100,
          travelFee: 50,
          emergencyCharge: 50
        }
      };
      urgency = {
        level: 'critical',
        reason: 'Water damage risk',
        isSafeToDrive: true
      };
      professionalNeeded = {
        category: 'plumber',
        specialty: 'Pipe Repair',
        experienceRequired: 3
      };
      followUpQuestions = [
        'Is the water flow continuous or dripping?',
        'Can you see the exact leak point?',
        'Is there any water damage nearby?',
        'When did you first notice this?'
      ];
      response = "🔧 **Water Leak Detected**\n\nI've analyzed your issue. Here's what I found:\n\n**Likely Issue:** Pipe burst (60% probability)\n\n**Estimated Cost:** ₹350 – ₹800\n\n**Urgency:** Critical — Water damage can increase quickly.\n\n**Recommendation:** Turn off the main water valve immediately.\n\nI've dispatched a plumber to your location. They'll arrive shortly!";
    }
    
    // Electrical issues
    else if (lowerInput.includes('electric') || lowerInput.includes('power') || lowerInput.includes('wiring')) {
      category = 'electrical';
      issue = 'Electrical issue';
      probableCauses = [
        { cause: 'Circuit trip', percentage: 50 },
        { cause: 'Wiring issue', percentage: 30 },
        { cause: 'Appliance fault', percentage: 20 }
      ];
      priceEstimate = {
        min: 400,
        max: 900,
        breakdown: {
          serviceCharge: 300,
          parts: 150,
          travelFee: 50,
          emergencyCharge: 50
        }
      };
      urgency = {
        level: 'high',
        reason: 'Electrical safety risk',
        isSafeToDrive: true
      };
      professionalNeeded = {
        category: 'electrician',
        specialty: 'Wiring & Circuit',
        experienceRequired: 4
      };
      followUpQuestions = [
        'Is the main circuit breaker tripped?',
        'Are other appliances working?',
        'Did this happen suddenly?',
        'Have you tried resetting the breaker?'
      ];
      response = "⚡ **Electrical Issue Detected**\n\nI've analyzed your issue. Here's what I found:\n\n**Likely Issue:** Circuit trip (50% probability)\n\n**Estimated Cost:** ₹400 – ₹900\n\n**Urgency:** High — Electrical issues can be dangerous.\n\n**Recommendation:** Do not touch exposed wires. Call an electrician immediately.\n\nI've notified nearby electricians. They'll contact you shortly!";
    }
    
    // AC issues
    else if (lowerInput.includes('ac') || lowerInput.includes('cooling') || lowerInput.includes('temperature')) {
      category = 'ac_repair';
      issue = 'AC not cooling';
      probableCauses = [
        { cause: 'Low refrigerant', percentage: 50 },
        { cause: 'Compressor issue', percentage: 30 },
        { cause: 'Filter blockage', percentage: 20 }
      ];
      priceEstimate = {
        min: 500,
        max: 1200,
        breakdown: {
          serviceCharge: 350,
          parts: 200,
          travelFee: 50,
          emergencyCharge: 50
        }
      };
      urgency = {
        level: 'medium',
        reason: 'Comfort issue',
        isSafeToDrive: true
      };
      professionalNeeded = {
        category: 'ac_repair',
        specialty: 'AC Service',
        experienceRequired: 3
      };
      followUpQuestions = [
        'Is the outdoor unit running?',
        'Have you cleaned the air filter recently?',
        'Is the thermostat set correctly?',
        'When was the last service done?'
      ];
      response = "❄️ **AC Cooling Issue**\n\nI've analyzed your issue. Here's what I found:\n\n**Likely Issue:** Low refrigerant (50% probability)\n\n**Estimated Cost:** ₹500 – ₹1,200\n\n**Urgency:** Medium — Comfort issue, not emergency.\n\n**Recommendation:** Schedule AC service at the earliest.\n\nI'll connect you with an AC specialist!";
    }
    
    // Default response
    else {
      response = "🔍 **I'm analyzing your issue...**\n\nTo help you better, please provide more details:\n\n1. What type of service do you need? (Mechanic/Plumber/Electrician/AC)\n2. What is the exact problem?\n3. When did it start?\n\nYou can also upload a photo or video for better diagnosis!";
    }
    
    return {
      analysis: {
        issue,
        category,
        confidence: 85,
        probableCauses
      },
      priceEstimate,
      urgency,
      professionalNeeded,
      followUpQuestions,
      response
    };
  }

  // ============================================================
  // 4. PROCESS IMAGE INPUT
  // ============================================================
  static async processImageInput(imageUrl) {
    // Simulate image analysis
    return {
      analysis: {
        issue: 'Visible damage detected',
        category: 'general',
        confidence: 75,
        probableCauses: [
          { cause: 'Physical damage', percentage: 60 },
          { cause: 'Wear and tear', percentage: 30 },
          { cause: 'Installation issue', percentage: 10 }
        ]
      },
      priceEstimate: {
        min: 400,
        max: 1000,
        breakdown: {
          serviceCharge: 250,
          parts: 200,
          travelFee: 50,
          emergencyCharge: 50
        }
      },
      urgency: {
        level: 'medium',
        reason: 'Visible damage detected',
        isSafeToDrive: true
      },
      professionalNeeded: {
        category: 'general',
        specialty: 'General Repair',
        experienceRequired: 2
      },
      response: "📷 **Image Analysis Complete**\n\nI've analyzed your image and detected visible damage.\n\n**Estimated Cost:** ₹400 – ₹1,000\n\nA professional will assess this in detail during the visit.\n\nI'm finding the best available professional for you!"
    };
  }

  // ============================================================
  // 5. GET AI ANALYSIS HISTORY
  // ============================================================
  static async getAnalysisHistory(userId, limit = 20) {
    try {
      const analyses = await AIAnalysis.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return {
        success: true,
        data: analyses
      };
    } catch (error) {
      console.error('Get AI history error:', error);
      return {
        success: false,
        message: 'Failed to fetch history'
      };
    }
  }

  // ============================================================
  // 6. RATE AI RESPONSE
  // ============================================================
  static async rateAIResponse(analysisId, userId, rating, helpful, comment) {
    try {
      const analysis = await AIAnalysis.findOne({ _id: analysisId, userId });
      if (!analysis) {
        return {
          success: false,
          message: 'Analysis not found'
        };
      }
      
      analysis.userFeedback = {
        helpful,
        rating,
        comment
      };
      analysis.isReviewed = true;
      await analysis.save();
      
      return {
        success: true,
        message: 'Feedback submitted'
      };
    } catch (error) {
      console.error('Rate AI error:', error);
      return {
        success: false,
        message: 'Failed to submit feedback'
      };
    }
  }
}

module.exports = AIService;