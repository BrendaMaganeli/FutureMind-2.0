// Servidor Socket.IO otimizado para redes diferentes
const express = require("express")
const https = require("https")
const fs = require("fs")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()

// Configuração CORS para permitir diferentes origens
app.use(
  cors({
    origin: ["https://seu-dominio.com", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
)

// Para HTTPS (necessário para WebRTC entre redes diferentes)
const serverOptions = {
  key: fs.readFileSync("path/to/private-key.pem"),
  cert: fs.readFileSync("path/to/certificate.pem"),
}

const server = https.createServer(serverOptions, app)

const io = socketIo(server, {
  cors: {
    origin: ["https://seu-dominio.com", "http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
})

const users = new Map()
const rooms = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join", (userData) => {
    // Verifica se o nome já está em uso
    const existingUser = Array.from(users.values()).find((user) => user.name === userData.name)
    if (existingUser && existingUser.id !== socket.id) {
      socket.emit("name-taken", { message: "Este nome já está em uso!" })
      return
    }

    users.set(socket.id, {
      id: socket.id,
      name: userData.name,
      joinedAt: new Date(),
    })

    // Envia lista de usuários para todos
    io.emit("users", Array.from(users.values()))
    console.log("User joined:", userData.name)
  })

  socket.on("offer", (data) => {
    console.log("Offer from", socket.id, "to", data.to)
    socket.to(data.to).emit("offer", {
      offer: data.offer,
      from: socket.id,
      retry: data.retry || 0,
    })
  })

  socket.on("answer", (data) => {
    console.log("Answer from", socket.id, "to", data.to)
    socket.to(data.to).emit("answer", {
      answer: data.answer,
      from: socket.id,
    })
  })

  socket.on("ice-candidate", (data) => {
    console.log("ICE candidate from", socket.id, "to", data.to, "type:", data.candidate?.type)
    socket.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id,
    })
  })

  socket.on("end-call", (data) => {
    console.log("Call ended by", socket.id)
    socket.to(data.to).emit("end-call", {
      from: socket.id,
      reason: data.reason,
    })
  })

  socket.on("connection-retry", (data) => {
    console.log("Connection retry from", socket.id, "attempt:", data.attempt)
    socket.to(data.to).emit("connection-retry", {
      from: socket.id,
      attempt: data.attempt,
    })
  })

  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, "reason:", reason)
    users.delete(socket.id)

    // Notifica outros usuários sobre a desconexão
    socket.broadcast.emit("user-disconnected", socket.id)

    // Atualiza lista de usuários
    io.emit("users", Array.from(users.values()))
  })

  // Heartbeat para manter conexão ativa
  socket.on("ping", () => {
    socket.emit("pong")
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTPS Server running on port ${PORT}`)
  console.log("Active users will be tracked")
})

// Limpeza periódica de usuários inativos
setInterval(
  () => {
    const now = new Date()
    for (const [socketId, user] of users.entries()) {
      if (now - user.joinedAt > 24 * 60 * 60 * 1000) {
        // 24 horas
        users.delete(socketId)
      }
    }
  },
  60 * 60 * 1000,
) // Executa a cada hora