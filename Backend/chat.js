module.exports = (io, socket) => {
  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);
    io.to(roomId).emit("user-joined", { id: socket.id, userName });
  });

  socket.on("send-message", ({ roomId, message, userName }) => {
    io.to(roomId).emit("receive-message", { userName, message });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", { id: socket.id });
  });
};
