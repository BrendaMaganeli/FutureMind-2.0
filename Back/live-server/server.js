const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);
  
  // Adiciona à lista de usuários conectados
  if (!connectedUsers.includes(socket.id)) {
    connectedUsers.push(socket.id);
  }
  
  // Envia lista atualizada para todos
  io.emit('users', connectedUsers);

  // Handler para ofertas
  socket.on('offer', (data) => {
    console.log(`Oferta de ${data.from} para ${data.to}`);
    socket.to(data.to).emit('offer', {
      offer: data.offer,
      from: data.from
    });
  });

  // Handler para respostas
  // ...código anterior permanece igual

socket.on('answer', (data) => {
  console.log(`Resposta para ${data.to}`);
  socket.to(data.to).emit('answer', { answer: data.answer });
});

// ...restante igual

  // Handler para ICE candidates
  socket.on('ice-candidate', (data) => {
    console.log(`ICE candidate para ${data.to}`);
    socket.to(data.to).emit('ice-candidate', {
      candidate: data.candidate
    });
  });

  // Handler para desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    connectedUsers = connectedUsers.filter(id => id !== socket.id);
    io.emit('users', connectedUsers);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));