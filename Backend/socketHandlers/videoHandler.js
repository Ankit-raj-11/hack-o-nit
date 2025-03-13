module.exports = (io, socket) => {
  socket.on("signal", ({ roomId, signalData, userId }) => {
    io.to(userId).emit("signal-received", { signalData, senderId: socket.id });
  });

  socket.on("join-video-call", ({ roomId, stream }) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("video-call", stream);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};
