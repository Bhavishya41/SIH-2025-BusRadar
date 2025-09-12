const express = require('express');
const Route = require('../models/Route');
const Stop = require('../models/Stop');

const router = express.Router();

// Get all routes with stops populated
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().populate('stops');
    res.json({ routes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Find routes given from & to stop names (MUST be before '/:id')
router.get('/find', async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(400).json({ error: 'Both "from" and "to" query parameters are required' });
    }

    try {
        const fromStop = await Stop.findOne({ name: from });
        const toStop = await Stop.findOne({ name: to });

        if (!fromStop || !toStop) {
            return res.status(404).json({ error: 'One or both stops not found' });
        }

        const routes = await Route.find({
            stops: { $all: [fromStop._id, toStop._id] }
        }).populate('stops');

        if (!routes || routes.length === 0) {
            return res.status(404).json({ error: 'No routes found between the specified stops' });
        }

        // Further logic to ensure the order of stops if necessary
        const validRoutes = routes.filter(route => {
            const fromIndex = route.stops.findIndex(stop => stop.name === from);
            const toIndex = route.stops.findIndex(stop => stop.name === to);
            return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        });

        if (validRoutes.length === 0) {
            return res.status(404).json({ error: 'No direct routes found in the correct order between the specified stops' });
        }


        res.json({ routes: validRoutes });
    } catch (err) {
        res.status(500).json({ error: 'Failed to find routes' });
        console.log(err);
    }
});

// Get a single route by ID (placed AFTER /find to avoid capturing 'find' as :id)
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('stops');
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json({ route });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

router.post('/stops', async (req, res) => {
  const { name, coordinates } = req.body; // coordinates: [lng, lat]
  if (!name || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({ error: 'name and coordinates [lng, lat] are required' });
  }
  try {
    const stop = new Stop({ name, location: { type: 'Point', coordinates } });
    await stop.save();
    res.status(201).json({ stop });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stop' });
  }
});

// Create a new route with existing stop IDs (admin only)
// Body: { routeId, name, stops: [stopObjectId1, stopObjectId2, ...] }
router.post('/', async (req, res) => {
  const { routeId, name, stops } = req.body;
  if (!routeId || !name || !Array.isArray(stops) || stops.length < 2) {
    return res.status(400).json({ error: 'routeId, name and at least two stop ids are required' });
  }
  try {
    const existing = await Route.findOne({ routeId });
    if (existing) {
      return res.status(409).json({ error: 'Route with this routeId already exists' });
    }
    const route = new Route({ routeId, name, stops });
    await route.save();
    await route.populate('stops');
    res.status(201).json({ route });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create route' });
  }
});

module.exports = router;
