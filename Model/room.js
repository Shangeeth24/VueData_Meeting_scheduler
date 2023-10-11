// Model/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: Number,
    unique: true
  },
  room: {
    type: String,
  },
});

module.exports = mongoose.model("Room", roomSchema);
