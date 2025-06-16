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
<<<<<<< HEAD
  },
=======
    transports: ['websocket', 'polling'], // Melhor compatibilidade
    allowUpgrades: false // Manter WebSocket
  },
  pingInterval: 10000,
  pingTimeout: 5000
>>>>>>> 9a1b587d49ddb075a1ae7bb59a97cd033691cf12
});

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);
<<<<<<< HEAD
  connectedUsers.push(socket.id);
=======
  const { name } = socket.handshake.auth;
  const user = {name: name || 'Antonio', id: socket.id}
  connectedUsers.push(user);
  
>>>>>>> 9a1b587d49ddb075a1ae7bb59a97cd033691cf12
  io.emit('users', connectedUsers);

  // WebRTC Signaling
  socket.on('offer', (data) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 9a1b587d49ddb075a1ae7bb59a97cd033691cf12
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
    io.emit('users', connectedUsers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));