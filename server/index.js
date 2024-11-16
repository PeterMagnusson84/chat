const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const Message = require('./models/Messages');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

connectDB(); // Connect to MongoDB

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join room', async (room) => {
    socket.join(room);
    // Send existing messages for the room to the client
    const messages = await Message.find({ room });
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
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
