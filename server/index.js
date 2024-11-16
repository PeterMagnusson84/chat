// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const Message = require('./models/Messages');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // allow requests from the React app
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join room', (room) => {
    socket.join(room);
  });

  // Send existing messages to the client
  Message.find().then(messages => {
    socket.emit('init', messages);
  });

  // Handle receiving a message and broadcasting it
  socket.on('chat message', async (msg) => {
    const message = new Message(msg);
    await message.save();
    io.to(msg.room).emit('chat message', msg);
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
