const { Server } = require("socket.io");
require("dotenv").config();

const onlineUsers = {}; // username -> socketId
let io
const socketHandler = (server) => {
  const allowedOrigins = process.env.api.split(",");
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (username) => {
      // console.log("register user", username);

      onlineUsers[username] = socket.id;

      // console.log("all users ", onlineUsers);

      // send updated online users list to everyone
      io.emit("online_users", Object.keys(onlineUsers));
    });


    // private msg

    socket.on("private_message", ({ from, to, message }) => {

      const receiverSocketId = onlineUsers[to];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private_message", {
          from,
          message,
        });

      } else {
      }
    });

    // GROUP MESSAGE (1-to-ALL)
    socket.on("group_message", ({ from, message }) => {


      io.emit("group_message", {
        from,
        message,
      });
    });

    // DISCONNECT
    // =====================
    socket.on("disconnect", () => {

      for (let user in onlineUsers) {
        if (onlineUsers[user] === socket.id) {
          delete onlineUsers[user];
        }
      }

      io.emit("online_users", Object.keys(onlineUsers));
    });
  });
};
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { socketHandler, getIO };
