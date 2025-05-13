const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
 //2

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
    console.log("Repassando oferta de", socket.id);
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log("Repassando resposta de", socket.id);
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    console.log("Repassando candidato ICE de", socket.id);
    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});