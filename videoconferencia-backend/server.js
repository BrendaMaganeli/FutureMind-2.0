const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Usuário conectado: ", socket.id);

  socket.on("offer", (data) => {
    console.log("Repassando oferta", data);
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log("Repassando resposta", data);
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    console.log("Repassando candidato ICE", data);
    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("chat-message", (message) => {
    console.log("Repassando mensagem de chat", message);
    socket.broadcast.emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado: ", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
