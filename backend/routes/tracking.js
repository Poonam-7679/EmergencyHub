const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const axios = require('axios');

// ============================================================
// 1. UPDATE PROVIDER LOCATION
// ============================================================
router.post('/update-location', auth, async (req, res) => {
  try {
    const { bookingId, lat, lng } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the assigned provider
    if (booking.providerId && booking.providerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only assigned provider can update location'
      });
    }

    booking.location.coordinates = { lat, lng };
    await booking.save();

    res.json({
      success: true,
      message: 'Location updated',
      data: { lat, lng }
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
});

// ============================================================
// 2. GET TRACKING INFO (with Google Maps ETA)
// ============================================================
router.get('/booking/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate('providerId', 'name phone')
      .populate('userId', 'name phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.userId._id.toString() !== userId && 
        booking.providerId?._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let eta = null;
    let distance = null;

    // If coordinates exist, calculate ETA using Google Maps
    if (booking.location.coordinates?.lat && booking.location.coordinates?.lng) {
      try {
        const { lat, lng } = booking.location.coordinates;
        const destination = `${lat},${lng}`;
        const origin = '23.2599,77.4126'; // Default: Bhopal

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.rows[0]?.elements[0]?.status === 'OK') {
          distance = response.data.rows[0].elements[0].distance?.text || null;
          eta = response.data.rows[0].elements[0].duration?.text || null;
        }
      } catch (error) {
        console.error('Google Maps API error:', error.message);
      }
    }

    // Generate Google Maps link
    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.location.address)}`;

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        provider: booking.providerId ? {
          name: booking.providerId.name,
          phone: booking.providerId.phone
        } : null,
        customer: {
          name: booking.userId.name,
          phone: booking.userId.phone
        },
        location: booking.location,
        status: booking.status,
        eta: eta || 'Calculating...',
        distance: distance || 'Calculating...',
        mapsLink: mapsLink,
        timeline: booking.timeline
      }
    });

  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tracking info'
    });
  }
});

// ============================================================
// 3. GET NEARBY PROVIDERS (Google Maps)
// ============================================================
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 5, service } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required'
      });
    }

    // Find providers from database
    const providers = await User.find({
      'providerDetails.isProvider': true,
      'providerDetails.isVerified': true,
      'providerDetails.services': service ? { $in: [service] } : { $exists: true }
    }).limit(10);

    // Get distances using Google Maps
    let providersWithDistance = [];
    if (providers.length > 0 && process.env.GOOGLE_MAPS_API_KEY) {
      try {
        const destinations = providers.map(p => 
          `${p.providerDetails?.location?.lat || 23.2599},${p.providerDetails?.location?.lng || 77.4126}`
        ).join('|');
        
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.rows[0]?.elements) {
          providersWithDistance = providers.map((p, i) => ({
            ...p.toObject(),
            distance: response.data.rows[0].elements[i]?.distance?.text || 'Unknown'
          }));
        }
      } catch (error) {
        console.error('Google Maps distance error:', error.message);
        providersWithDistance = providers;
      }
    } else {
      providersWithDistance = providers;
    }

    res.json({
      success: true,
      data: {
        providers: providersWithDistance.map(p => ({
          id: p._id,
          name: p.name,
          phone: p.phone,
          rating: p.providerDetails?.rating || 0,
          services: p.providerDetails?.services || [],
          distance: p.distance || 'Unknown'
        })),
        searchLocation: { lat, lng },
        radius: radius
      }
    });

  } catch (error) {
    console.error('Nearby providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby providers'
    });
  }
});

// ============================================================
// 4. GENERATE MAPS LINK
// ============================================================
router.get('/maps-link/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.location.address)}`;

    res.json({
      success: true,
      data: {
        mapsLink: mapsLink,
        address: booking.location.address,
        coordinates: booking.location.coordinates
      }
    });

  } catch (error) {
    console.error('Maps link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate maps link'
    });
  }
});

module.exports = router;