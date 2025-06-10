const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  socket.on('sendMessage', (message) => {
    // Emite para ambos os participantes
    socket.to(message.roomId).emit('receiveMessage', message);
    socket.emit('receiveMessage', message); // Para o remetente
  });

  socket.on("joinRoom", (roomId) => {
  socket.join(roomId); // Entra na sala
});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
