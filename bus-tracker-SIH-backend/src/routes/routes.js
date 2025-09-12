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

// Get a single route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('stops');
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json({ route });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

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
    }
});

module.exports = router;
