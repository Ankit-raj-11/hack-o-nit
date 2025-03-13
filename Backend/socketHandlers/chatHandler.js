const { v4: uuidv4 } = require("uuid");
const Room = require("../models/room");
const User = require("../models/user");
const Message = require("../models/message");

module.exports = (io, socket) => {
  socket.on("join-room", async ({ roomId, email }) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        socket.join(roomId);
        io.to(roomId).emit("user-joined", { id: socket.id, email });

        // Retrieve and send previous messages
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        socket.emit("previous-messages", messages);
      } else {
        socket.emit("error", "User not found");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Error joining room");
    }
  });

  socket.on("create-room", async ({ roomName }) => {
    try {
      const roomId = uuidv4(); // Generate unique room ID
      const room = new Room({ roomId, roomName });
      await room.save();
      io.emit("room-created", { roomId, roomName });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  });

  socket.on("delete-room", async ({ roomId }) => {
    try {
      await Room.deleteOne({ roomId });
      io.emit("room-deleted", { roomId });
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  });

  socket.on("send-message", async ({ roomId, message, email }) => {
    try {
      const newMessage = new Message({ roomId, email, message });
      await newMessage.save();
      io.to(roomId).emit("receive-message", { email, message });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    io.emit("user-left", { id: socket.id });
  });
};
