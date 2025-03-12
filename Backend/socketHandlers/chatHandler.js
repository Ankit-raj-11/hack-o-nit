module.exports = (io, socket) => {
  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);
    io.to(roomId).emit("user-joined", { id: socket.id, userName });
  });

  socket.on("send-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("receive-message", { username, message });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", { id: socket.id });
  });
};
