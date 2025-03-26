const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Altere conforme necessário
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("Usuário conectado", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // Envia para todos os usuários
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});