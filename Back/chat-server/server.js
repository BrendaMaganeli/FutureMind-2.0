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

app.use(cors({origin: '*'}));

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`Usuário ${socket.id} saiu da sala ${roomId}`);
  });

  socket.on("sendMessage", (message) => {
    const { roomId } = message;
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
