const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  meetingId: Number,
  startTime: Date,
  endTime: Date,
  employeeId: String,
  roomId: String
});

const Data = mongoose.model('Data', userSchema);
module.exports = Data;
