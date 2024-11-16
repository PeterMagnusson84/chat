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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', // Correct reference to the Room model
    required: true,
  }
});

// Specify the collection name as 'Messages'
const Message = mongoose.model('Message', MessageSchema, 'Messages');

module.exports = Message;