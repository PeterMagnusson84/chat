// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // allow requests from the React app
    methods: ["GET", "POST"]
  }
});

const rooms = new Set();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle joining a room
  socket.on('join room', (room) => {
    socket.join(room);
    rooms.add(room);
    console.log(`User joined room: ${room}`);
    console.log('Active rooms:', Array.from(rooms));
  });

  // Handle receiving a message and broadcasting it
  socket.on('chat message', ({ room, username, text, timestamp }) => {
    io.to(room).emit('chat message', { room, username, text, timestamp }); // broadcast to all clients in the room
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
