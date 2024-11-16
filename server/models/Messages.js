const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  room: {
    type: String,
    required: true,
  }
});

// Specify the collection name as 'Messages'
const Message = mongoose.model('Message', MessageSchema, 'messages');

module.exports = Message;