
const express = require('express');
const jwt = require('jsonwebtoken');
const { Driver, Admin } = require('../models/users');

module.exports = (io) => {
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET;

  // Simple auth middleware for admin protected endpoints
  function adminAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
      req.user = payload;
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Register a new driver (returns JWT)
  router.post('/register', async (req, res) => {
    const { driverId, name, busId, password } = req.body;
    if (!driverId || !name || !busId || !password) {
      return res.status(400).json({ error: 'driverId, name, busId, and password are required' });
    }
    try {
      let driver = await Driver.findOne({ driverId });
      if (driver) {
        return res.status(409).json({ error: 'Driver already exists' });
      }
      driver = new Driver({ driverId, name, busId, password, role: 'driver' });
      await driver.save();
      const token = jwt.sign({ driverId: driver.driverId, name: driver.name, role: 'driver' }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ success: true, driver, token });
    } catch (err) {
      res.status(500).json({ error: 'Failed to register driver' });
      console.log(err);
    }
  });

  // Login (driver or admin)
  // Driver: { driverId, password }
  // Admin:  { username, password }
  router.post('/login', async (req, res) => {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfiguration: JWT secret missing' });
    }

    const { driverId, password } = req.body;
    if (!password || !driverId ) {
      return res.status(400).json({ error: 'Provide password and either driverId or username' });
    }

    try {
      let userDoc;

      userDoc = await Driver.findOne({ driverId });
      if (!userDoc || userDoc.password !== password) {
        return res.status(401).json({ error: 'Invalid driverId or password' });
      }
      

      const payload = { driverId: userDoc.driverId, name: userDoc.name }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

      const sanitized = userDoc.toObject();
      delete sanitized.password;

      res.json({ success: true, user: sanitized, token });
    } catch (err) {
      console.error('Login error', err);
      res.status(500).json({ error: 'Failed to login user' });
    }
  });

  // List all drivers (admin only)
  router.get('/drivers', adminAuth, async (_req, res) => {
    try {
      const drivers = await Driver.find().select('-password');
      res.json({ drivers });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch drivers' });
    }
  });

  return router;
};