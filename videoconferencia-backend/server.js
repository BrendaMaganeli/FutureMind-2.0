const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = {}; // Armazena os usuários conectados

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  users[socket.id] = socket.id;

  // Enviar a lista de usuários conectados para todos
  io.emit("users-list", Object.keys(users));

  socket.on("offer", (data) => {
    io.to(data.target).emit("offer", { sdp: data.sdp, caller: socket.id });
  });

  socket.on("answer", (data) => {
    io.to(data.target).emit("answer", { sdp: data.sdp, responder: socket.id });
  });

  socket.on("ice-candidate", (data) => {
    io.to(data.target).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
    delete users[socket.id];
    io.emit("users-list", Object.keys(users));
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
