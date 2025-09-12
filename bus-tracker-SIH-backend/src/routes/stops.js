const express = require('express');
const Stop = require('../models/Stop');

const router = express.Router();

// Get all stops
router.get('/', async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json({ stops });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

// Get a single stop by ID
router.get('/:id', async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    res.json({ stop });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stop' });
  }
});

module.exports = router;