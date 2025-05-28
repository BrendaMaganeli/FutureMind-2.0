const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Usando Set para evitar IDs duplicados
const connectedUsers = new Set();

// Função para emitir usuários atualizados com debounce
let emitUsersTimeout;
const emitUsersUpdate = () => {
  clearTimeout(emitUsersTimeout);
  emitUsersTimeout = setTimeout(() => {
    io.emit("users", Array.from(connectedUsers));
  }, 100); // Debounce de 100ms
};

io.on("connection", (socket) => {
  console.log(`Novo usuário conectado: ${socket.id}`);
  connectedUsers.add(socket.id);
  emitUsersUpdate();

  socket.on("offer", ({ offer, to, from }) => {
    io.to(to).emit("offer", { offer, from });
  });

  socket.on("answer", ({ answer, to }) => {
    io.to(to).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    connectedUsers.delete(socket.id);
    emitUsersUpdate();
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});