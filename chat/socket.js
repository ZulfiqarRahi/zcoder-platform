module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ room, username }) => {
      socket.join(room);
      socket.username = username;
      socket.room = room;
      io.to(room).emit("systemMessage", `${username} has joined the room.`);
    });

    socket.on("sendMessage", ({ room, message, username }) => {
      io.to(room).emit("receiveMessage", { message, sender: username });
    });
  });
};