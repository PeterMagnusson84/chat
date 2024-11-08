// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // allow requests from the React app
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle receiving a message and broadcasting it
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // broadcast to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle reconnection attempts
  socket.on('reconnect_attempt', () => {
    console.log('User attempting to reconnect:', socket.id);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('User reconnected:', socket.id, 'Attempt:', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.log('Reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.log('Reconnection failed for user:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
