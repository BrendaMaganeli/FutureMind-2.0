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
  },
});

let connectedUsers = [];

io.on('connection', (socket) => {
  const { name } = socket.handshake.auth;
  console.log(`Novo usuário conectado: ${name} (${socket.id})`);
  
  // Atualize o formato do usuário para manter consistência
  const newUser = {
    id: socket.id,
    name: name || 'Usuário Anônimo'
  };
  
  // Adicione o novo usuário à lista
  connectedUsers.push(newUser);
  
  // Notifique todos sobre a nova lista de usuários
  io.emit('users', connectedUsers);

  // WebRTC Signaling
  socket.on('offer', (data) => {
    console.log(`Offer de ${data.from} para ${data.to}`);
    io.to(data.to).emit('offer', {
      offer: data.offer,
      from: data.from,
    });
  });

  socket.on('answer', (data) => {
    console.log(`Answer de ${data.from} para ${data.to}`);
    io.to(data.to).emit('answer', {
      answer: data.answer,
      from: data.from,
    });
  });

  socket.on('ice-candidate', (data) => {
    console.log(`ICE Candidate de ${socket.id} para ${data.to}`);
    io.to(data.to).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
    io.emit('users', connectedUsers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));