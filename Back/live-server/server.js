const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
 //2

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Usuário conectado: ", socket.id);

  socket.on("offer", ({ offer, to }) => {
    console.log(`Oferta de ${socket.id} para ${to}`);
    io.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ answer, to }) => {
    console.log(`Resposta de ${socket.id} para ${to}`);
    io.to(to).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    console.log(`ICE candidate de ${socket.id} para ${to}`);
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});