const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = {}; // Armazena os usuários conectados

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  users[socket.id] = socket.id;

  // Enviar a lista de usuários conectados para todos
  io.emit("users-list", Object.keys(users));

  socket.on("offer", (data) => {
    io.to(data.target).emit("offer", { sdp: data.sdp, caller: socket.id });
  });

  socket.on("answer", async ({ sdp, responder }) => {
    const peerConnection = peerConnection.current[responder];
    
    if (!peerConnection) {
      console.warn("PeerConnection não encontrada para o usuário:", responder);
      return;
    }
  
    // Verifica se o estado permite definir remoteDescription
    if (peerConnection.signalingState !== "stable") {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (error) {
        console.error("Erro ao definir remoteDescription (answer):", error);
      }
    } else {
      console.warn("Não foi possível definir a resposta SDP, pois o estado já está 'stable'.");
    }
  });
  

  socket.on("ice-candidate", (data) => {
    io.to(data.target).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
    delete users[socket.id];
    io.emit("users-list", Object.keys(users));
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
