const express = require('express');
const http = require('http');
const cors = require('cors');
const mongooseSetup = require('./middleware/mongooseSetup');
const busRouter = require('./routes/buses');
const routeRouter = require('./routes/routes');
const trackingRouter = require('./routes/tracking');
const path = require('path');
const Bus = require('./models/Bus');

const app = express();
const { Server: SocketIOServer } = require('socket.io');
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, '../views')));

// MongoDB connection
mongooseSetup();

// Routes
app.use('/api/tracking', trackingRouter(io)); // Pass io to tracking routes
app.use('/api/routes', routeRouter);
app.use('/api/buses', busRouter);
// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get("/map", function (req,res) {
  res.render("index.ejs");
})

// In-memory mapping of busId -> socketId (not persisted; resets on server restart)
const activeBusSockets = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle location updates from drivers
  socket.on('send-location', async (data = {}) => {
    try {
      const { busId, latitude, longitude } = data;
      // Basic validation
      if (!busId || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return; // Ignore malformed payloads
      }

      // Track which socket currently represents this bus
      activeBusSockets.set(busId, socket.id);

      // Broadcast a normalized event name for consumers
      const payload = { busId, latitude, longitude, at: Date.now() };
      io.emit('bus-location', payload);

      // Backward compatibility (legacy listener in BusMap.jsx)
      io.emit('recieve-location', { id: socket.id, ...payload });

      // Persist latest location to DB (fire & forget)
      Bus.findOneAndUpdate(
        { busId },
        {
          location: { type: 'Point', coordinates: [longitude, latitude] },
          lastUpdate: new Date()
        },
        { new: false }
      ).catch(() => {/* swallow errors to avoid crashing socket handler */});
    } catch (e) {
      console.error('send-location handler error', e);
    }
  });

  socket.on('disconnect', () => {
    // Remove any busIds mapped to this socket
    for (const [busId, sockId] of activeBusSockets.entries()) {
      if (sockId === socket.id) activeBusSockets.delete(busId);
    }
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});