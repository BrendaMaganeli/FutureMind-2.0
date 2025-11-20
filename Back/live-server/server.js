const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor WebRTC + Socket.IO ativo");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = {};

io.on("connection", (socket) => {
  const name = socket.handshake.auth?.name;
  if (!name) return;
  const nameAlreadyExists = Object.values(onlineUsers).includes(name);
  if (nameAlreadyExists) {
    socket.emit("name-taken", { message: "Nome já está em uso" });
    socket.disconnect();
    return;
  }

  onlineUsers[socket.id] = name;
  io.emit("users", Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

  socket.on("offer", ({ to, offer, from }) => {
    if (to && io.sockets.sockets.get(to)) {
      io.to(to).emit("offer", { offer, from });
    }
  });

  socket.on("answer", ({ to, answer, from }) => {
    if (to && io.sockets.sockets.get(to)) {
      io.to(to).emit("answer", { answer, from });
    }
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (to && io.sockets.sockets.get(to)) {
      io.to(to).emit("ice-candidate", { candidate });
    }
  });

  socket.on("end-call", ({ to, from }) => {
    if (to && io.sockets.sockets.get(to)) {
      io.to(to).emit("call-ended", { to, from });
    } else {
      if (from) {
        io.to(from).emit("call-ended", { to: from, from });
      }
    }
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("users", Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {});
