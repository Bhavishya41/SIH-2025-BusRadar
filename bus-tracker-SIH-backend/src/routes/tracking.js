const express = require('express');
const jwt = require('jsonwebtoken');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

module.exports = (io) => {
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET;

  // Register a driver and assign to a bus (returns JWT)
  router.post('/register', async (req, res) => {
    const { busId, driverName, routeId, password } = req.body;
    if (!busId || !driverName || !routeId || !password) {
      return res.status(400).json({ error: 'busId, driverName, routeId, and password are required' });
    }
    try {
      // Find or create the bus
      let bus = await Bus.findOne({ busId });
      if (!bus) {
        bus = new Bus({
          busId,
          driverName,
          route: routeId,
          location: { type: 'Point', coordinates: [0, 0] },
          status: 'active',
          password, // store password in plain text for demo (not secure)
        });
      } else {
        // Update driver and route if bus exists
        bus.driverName = driverName;
        bus.route = routeId;
        bus.status = 'active';
        bus.password = password;
      }
      await bus.save();
      await bus.populate('route');
      // Create JWT
      const token = jwt.sign({ busId: bus.busId, driverName: bus.driverName }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ success: true, bus, token });
    } catch (err) {
      res.status(500).json({ error: 'Failed to register driver' });
      console.log(err);
    }
  });

  // Login a driver (returns JWT)
  router.post('/login', async (req, res) => {
    const { busId, password } = req.body;
    if (!busId || !password) {
      return res.status(400).json({ error: 'busId and password are required' });
    }
    try {
      const bus = await Bus.findOne({ busId });
      if (!bus || bus.password !== password) {
        return res.status(401).json({ error: 'Invalid busId or password' });
      }
      // Create JWT
      const token = jwt.sign({ busId: bus.busId, driverName: bus.driverName }, JWT_SECRET, { expiresIn: '12h' });
      await bus.populate('route');
      res.json({ success: true, bus, token });
    } catch (err) {
      res.status(500).json({ error: 'Failed to login driver' });
    }
  });

  return router;
};
