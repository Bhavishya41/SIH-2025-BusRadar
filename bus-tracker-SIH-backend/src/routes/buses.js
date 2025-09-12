const express = require('express');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

const router = express.Router();

// Get all active buses with route populated
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find({ status: 'active' }).populate('route');
    res.json({ buses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Get a single bus by ID
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('route');
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json({ bus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
});

router.get('/route/:routeId', async (req, res) => {
    try {
        const buses = await Bus.find({ route: req.params.routeId, status: 'active' }).populate('route');
        res.json({ buses });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch buses for the specified route' });
    }
});

module.exports = router;
