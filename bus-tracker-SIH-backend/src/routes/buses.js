const express = require('express');
const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

const router = express.Router();

// Helper populate config (route + its stops)
const routePopulate = { path: 'route', populate: { path: 'stops' } };

// Get all buses (active + inactive) with deep populated route + stops
router.get('/', async (_req, res) => {
  try {
    const buses = await Bus.find({}).populate(routePopulate);
    res.json({ buses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Get all active buses for a given route (ensure this route is defined BEFORE the single bus route)
router.get('/route/:routeId', async (req, res) => {
  try {
    const buses = await Bus.find({ route: req.params.routeId, status: 'active' }).populate(routePopulate);
    res.json({ buses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buses for the specified route' });
  }
});

// Get a single bus by Mongo _id OR (fallback) by domain busId string
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let bus = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      bus = await Bus.findById(id).populate(routePopulate);
    }
    if (!bus) {
      bus = await Bus.findOne({ busId: id }).populate(routePopulate);
    }
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json({ bus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
});

module.exports = router;
