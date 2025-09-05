const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true });
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rooms available for a specific day
router.get('/available/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const rooms = await Room.find({
      'availability.day': day,
      isActive: true
    });
    res.json(rooms);
  } catch (error) {
    console.error('Get available rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room availability for a specific day and time
router.get('/availability/:day/:time', async (req, res) => {
  try {
    const { day, time } = req.params;
    
    const rooms = await Room.find({
      'availability.day': day,
      'availability.timeSlots': {
        $elemMatch: {
          start: { $lte: time },
          end: { $gt: time }
        }
      },
      isActive: true
    });

    res.json(rooms);
  } catch (error) {
    console.error('Get room availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;