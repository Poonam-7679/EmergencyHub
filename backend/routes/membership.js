const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const { auth, admin } = require('../middleware/auth');

// ============================================================
// 1. GET USER MEMBERSHIP
// ============================================================
router.get('/my-membership', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    let membership = await Membership.findOne({ userId });

    if (!membership) {
      // Create default free membership
      membership = new Membership({
        userId,
        plan: 'free',
        planName: 'Free',
        price: 0,
        benefits: Membership.PLANS.free.benefits,
        isActive: true
      });
      await membership.save();
    }

    res.json({
      success: true,
      data: {
        plan: membership.plan,
        planName: membership.planName,
        price: membership.price,
        benefits: membership.benefits,
        isActive: membership.isActive,
        isExpired: membership.isExpired(),
        remainingDays: membership.getRemainingDays(),
        familyMembers: membership.familyMembers,
        canAddFamilyMember: membership.canAddFamilyMember()
      }
    });

  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get membership'
    });
  }
});

// ============================================================
// 2. UPGRADE MEMBERSHIP
// ============================================================
router.post('/upgrade', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, billingCycle } = req.body;

    const planDetails = Membership.PLANS[plan];
    if (!planDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    let membership = await Membership.findOne({ userId });
    if (!membership) {
      membership = new Membership({
        userId,
        plan: 'free',
        planName: 'Free',
        price: 0,
        benefits: Membership.PLANS.free.benefits
      });
    }

    // Update membership
    membership.plan = plan;
    membership.planName = planDetails.name;
    membership.price = planDetails.price;
    membership.benefits = planDetails.benefits;
    membership.billingCycle = billingCycle || 'monthly';
    membership.startDate = new Date();
    
    // Set end date
    const endDate = new Date();
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    membership.endDate = endDate;
    membership.isActive = true;
    membership.autoRenew = false;
    membership.updatedAt = new Date();

    await membership.save();

    res.json({
      success: true,
      message: `Membership upgraded to ${planDetails.name}`,
      data: {
        plan: membership.plan,
        planName: membership.planName,
        price: membership.price,
        endDate: membership.endDate,
        benefits: membership.benefits
      }
    });

  } catch (error) {
    console.error('Upgrade membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upgrade membership'
    });
  }
});

// ============================================================
// 3. ADD FAMILY MEMBER
// ============================================================
router.post('/add-family-member', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, relationship } = req.body;

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    if (!membership.canAddFamilyMember()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add more family members'
      });
    }

    membership.familyMembers.push({
      name,
      phone,
      email,
      relationship
    });
    await membership.save();

    res.json({
      success: true,
      message: 'Family member added',
      data: membership.familyMembers
    });

  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add family member'
    });
  }
});

// ============================================================
// 4. CANCEL MEMBERSHIP
// ============================================================
router.post('/cancel', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const membership = await Membership.findOne({ userId });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    if (membership.plan === 'free') {
      return res.status(400).json({
        success: false,
        message: 'Free plan cannot be cancelled'
      });
    }

    membership.isActive = false;
    membership.autoRenew = false;
    membership.updatedAt = new Date();
    await membership.save();

    res.json({
      success: true,
      message: 'Membership cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel membership'
    });
  }
});

// ============================================================
// 5. GET ALL PLANS (Public)
// ============================================================
router.get('/plans', async (req, res) => {
  try {
    const plans = Object.entries(Membership.PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      price: plan.price,
      benefits: plan.benefits
    }));

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans'
    });
  }
});

module.exports = router;