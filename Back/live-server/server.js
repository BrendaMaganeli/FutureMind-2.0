const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ou o seu front-end (ex: http://localhost:3000)
    methods: ["GET", "POST"]
  }
});

const onlineUsers = {}; // { socket.id: nome }

io.on('connection', (socket) => {
  const name = socket.handshake.auth?.name;

  if (!name) return;
  const nameAlreadyExists = Object.values(onlineUsers).includes(name);

  if (nameAlreadyExists) {
    console.log(`[Conexão recusada] Nome duplicado: ${name}`);
    socket.emit("name-taken", { message: "Nome já está em uso" });
    socket.disconnect(); // Desconecta o usuário
    return;
  }

  console.log(`[Conectado] ID: ${socket.id} | Nome: ${name}`);
  onlineUsers[socket.id] = name;

  // Envia a lista de usuários atualizada
  io.emit("users", Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

  socket.on("offer", ({ to, offer, from }) => {
    io.to(to).emit("offer", { offer, from });
  });

  socket.on("answer", ({ to, answer, from }) => {
    io.to(to).emit("answer", { answer, from });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log(`[Desconectado] ${socket.id}`);
    delete onlineUsers[socket.id];
    io.emit("users", Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
  });

  socket.on('end-call', (reason) => {

    io.emit('call-ended', reason);
  });
});
server.listen(5000, () => {
  console.log("Servidor Socket.IO rodando na porta 5000");
});