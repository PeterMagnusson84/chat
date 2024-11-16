const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

const Room = mongoose.model('Room', RoomSchema, 'Rooms');

module.exports = Room;