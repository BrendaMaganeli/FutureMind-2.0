const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'], // Melhor compatibilidade
    allowUpgrades: false // Manter WebSocket
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);
  const { name } = socket.handshake.auth;
  const user = {name: name || 'Antonio', id: socket.id}
  connectedUsers.push(user);
  
  io.emit('users', connectedUsers);

  socket.on('offer', (data) => {
    console.log(`Oferta de ${data.from} para ${data.to}`);
    const targetSocket = io.sockets.sockets.get(data.to);
    if (targetSocket) {
      targetSocket.emit("offer", {
        offer: data.offer,
        from: data.from
      });
    } else {
      console.log(`Target user ${data.to} not found`);
    }
  });

  socket.on('answer', (data) => {
    console.log(`Resposta de ${socket.id} para ${data.to}`);
    const targetSocket = io.sockets.sockets.get(data.to);
    if (targetSocket) {
      targetSocket.emit("answer", {
        answer: data.answer,
        from: data.from
      });
    }
  });

  socket.on('ice-candidate', (data) => {
    console.log(`ICE candidate de ${socket.id} para ${data.to}`);
    const targetSocket = io.sockets.sockets.get(data.to);
    if (targetSocket) {
      targetSocket.emit("ice-candidate", {
        candidate: data.candidate,
        from: socket.id
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
    io.emit('users', connectedUsers);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));