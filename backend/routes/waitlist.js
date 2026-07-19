
const express = require('express');
const router = express.Router();

const Waitlist = require('../models/Waitlist');


// =======================================
// JOIN WAITLIST
// =======================================

router.post('/', async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            address,
            latitude,
            longitude
        } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                success: false,
                message: 'Name, Email and Address are required'
            });
        }

        const existing = await Waitlist.findOne({ email });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You are already on the waitlist.'
            });
        }

        const user = await Waitlist.create({
            name,
            email,
            phone,
            address,
            latitude,
            longitude
        });

        res.status(201).json({
            success: true,
            message: 'Successfully joined EmergencyHub waitlist!',
            data: user
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }

});


// =======================================
// GET ALL WAITLIST USERS
// =======================================

router.get('/', async (req, res) => {

    const users = await Waitlist.find().sort({
        createdAt: -1
    });

    res.json({
        success: true,
        total: users.length,
        data: users
    });

});

module.exports = router;