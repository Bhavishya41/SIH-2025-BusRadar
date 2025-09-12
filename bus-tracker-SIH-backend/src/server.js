const express = require('express');
const http = require('http');
const cors = require('cors');
const mongooseSetup = require('./middleware/mongooseSetup');
const busRouter = require('./routes/buses');
const routeRouter = require('./routes/routes');
const trackingRouter = require('./routes/tracking');
const path = require('path');

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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('send-location', function(data){
    io.emit("recieve-location", {id:socket.id, ...data});
  
  })
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});