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
    methods: ["GET", "POST"]
  }
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
    io.to(data.to).emit('offer', {
      offer: data.offer,
      from: data.from
    });
  });

  socket.on('answer', (data) => {
    console.log(`Resposta de ${socket.id} para ${data.to}`);
    io.to(data.to).emit('answer', {
      answer: data.answer,
      from: data.from
    });
  });

  socket.on('ice-candidate', (data) => {
    console.log(`ICE candidate de ${socket.id} para ${data.to}`);
    io.to(data.to).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });

  socket.on('disconnect', () => {
  console.log(`Usuário desconectado: ${socket.id}`);
  connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
  io.emit('users', connectedUsers);
});

});

const PORT = 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));