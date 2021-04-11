const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config({});
const server = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3000;
const { saveMessage, addUserToRoom } = require("./helpers");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

mongoose.connect(
  process.env.MONGO_URL,
  // process.env.LOCAL_MONGO_URL,
  {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log("Mongoose connection error", err.message);
    }
    mongoose.connection.once("open", () => {
      console.log("Mongodb connected");
    });
  }
);

io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  const { id } = await jwt.verify(token, process.env.SALT);
  socket.userId = id;

  next();
});

io.on("connect", (socket) => {
  console.log("connect");
  // event with sending error
  socket.on("joinRoom", async ({ userName, chatroomId }, callback) => {
    const user = socket.userId;
    const { isMember, error } = await addUserToRoom({
      chatroomId,
      user,
    });
    if (error) {
      callback(error);
    }

    socket.join(chatroomId);
    if (!isMember) {
      socket.emit("newMessage", { text: "Welcome " + userName });
      io.to(chatroomId).emit("newMessage", {
        text: userName + " joined the room " + chatroomId,
      });
    }
  });
  socket.on("chatroomMessage", async ({ chatroomId, message }, callback) => {
    const chatMessageToSave = {
      text: message,
      user: socket.userId,
      chatroom: chatroomId,
    };

    const { savedMessage, error } = await saveMessage(chatMessageToSave);

    if (error) {
      callback(error);
    }
    if (savedMessage) {
      io.to(chatroomId).emit("newMessage", savedMessage);
    }
  });
  socket.on("newRoomCreated", () => {
    socket.emit("newRoomCreated");
  });
  socket.on("roomDeleted", () => {
    io.emit("roomDeleted");
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
