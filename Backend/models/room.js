const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomName: { type: String, required: true },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
