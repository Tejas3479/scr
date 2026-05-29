// FarmQuest Next-Gen High-Frequency Realtime Sync Service
// Location: services/realtime-service/src/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Configure Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()]
});

app.use(express.json());

// Enable basic CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

const server = http.createServer(app);

// Setup Socket.io with permissive CORS for local client gateways
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// REST Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'realtime-service',
    connected_clients: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

// WebSocket Event Orchestration
io.on('connection', (socket) => {
  logger.info(`🔌 Client connected to Real-Time mesh: ${socket.id}`);

  // Ingest BCI / Brain State telemetry from client
  socket.on('bci.telemetry', (payload) => {
    logger.info(`🧠 BCI Telemetry received from ${socket.id}:`, payload);
    // Broadcast to monitoring nodes or save in PostgreSQL
    socket.broadcast.emit('bci.stream', { client: socket.id, ...payload, timestamp: new Date() });
  });

  // Ingest drone fleet coordinates
  socket.on('drone.update', (coords) => {
    logger.info(`🛸 Drone coordinates updated by ${socket.id}:`, coords);
    socket.broadcast.emit('drone.telemetry', { drone_id: socket.id, coords, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Ingest manual IoT telemetry updates from REST clients
app.post('/api/realtime/sensor-ping', (req, res) => {
  const { sensorId, type, value, location } = req.body;
  if (!sensorId || !type || value === undefined) {
    return res.status(400).json({ error: 'SensorId, type, and value are required.' });
  }

  const telemetryPayload = {
    sensorId,
    type,
    value,
    location: location || null,
    timestamp: new Date().toISOString()
  };

  // Broadcast telemetry package to all active WebGL clients
  io.emit('sensor.telemetry', telemetryPayload);
  logger.info(`📡 IoT sensor telemetry ingested & broadcasted:`, telemetryPayload);

  res.json({ success: true, message: 'Telemetry broadcast completed' });
});

// Active background simulator (Streams high-frequency mock soil & drone coordinates to simulate field mesh)
setInterval(() => {
  if (io.engine.clientsCount > 0) {
    const mockMoistureTelemetry = {
      sensorId: 'sensor-alpha-12',
      type: 'soil_moisture',
      value: (58 + Math.sin(Date.now() * 0.001) * 6).toFixed(2),
      timestamp: new Date().toISOString()
    };
    
    const mockDroneCoords = {
      droneId: 'drone-quad-01',
      latitude: (28.7041 + Math.sin(Date.now() * 0.0001) * 0.005).toFixed(6),
      longitude: (77.1025 + Math.cos(Date.now() * 0.0001) * 0.005).toFixed(6),
      battery: (88.2 - (Date.now() % 10000) * 0.0005).toFixed(1),
      timestamp: new Date().toISOString()
    };

    io.emit('sensor.telemetry', mockMoistureTelemetry);
    io.emit('drone.telemetry', mockDroneCoords);
  }
}, 3000); // Pulse every 3 seconds

server.listen(PORT, () => {
  logger.info(`🚀 Next-Gen Real-Time Sync Service running on port ${PORT}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});
