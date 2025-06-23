"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"
import "./CSS/Call.css"

const rawUser = localStorage.getItem("User-Profile")
let socket

if (rawUser) {
  try {
    const user = JSON.parse(rawUser)

    // Para redes diferentes, o servidor precisa ser acessível publicamente
    // Substitua pelo seu IP público ou domínio
    socket = io('https://futuremind-20-production.up.railway.app', {
      // Use HTTPS para redes diferentes
      auth: {
        name: user?.nome,
      },
      reconnectionAttempts: 10, // Mais tentativas para redes diferentes
      reconnectionDelay: 2000,
      timeout: 20000, // Timeout maior para redes diferentes
      transports: ["websocket", "polling"],
      forceNew: true,
    })
  } catch (error) {
    console.error("Erro ao parsear o user do localStorage:", error)
  }
}

function VideoConferencia() {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnection = useRef(null)
  const localStreamRef = useRef(null)
  const navigate = useNavigate()
  const [videoActive, setVideoActive] = useState(true)
  const [micActive, setMicActive] = useState(true)
  const [callInProgress, setCallInProgress] = useState(false)
  const [incomingOffer, setIncomingOffer] = useState(null)
  const [targetUser, setTargetUser] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [configBarVisible, setConfigBarVisible] = useState(true)
  const [espelhar, setEspelhar] = useState("mirror")
  const [isCaller, setIsCaller] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("Disconnected")
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: 1245, y: 40 })
  const dragOffset = useRef({ x: 0, y: 0 })
  const [callTime, setCallTime] = useState(0)
  const timerRef = useRef(null)
  const [iceGatheringState, setIceGatheringState] = useState("")
  const [salaDeEspera, setSalaDeEspera] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState("")
  const [iceConnectionState, setIceConnectionState] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
          },
        })
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing media devices:", error)
        setError("Não foi possível acessar câmera/microfone. Verifique as permissões.")
      }
    }

    initializeMedia()

    const handleConnect = () => {
      setConnectionStatus("Connected")
      setError(null)
      setRetryCount(0)
      console.log("Conectado ao servidor Socket.IO")
    }

    const handleConnectError = (err) => {
      setConnectionStatus("Connection Failed")
      setError(`Falha na conexão: ${err.message}`)
      console.error("Connection error:", err)
    }

    const handleDisconnect = (reason) => {
      setConnectionStatus("Disconnected")
      if (reason === "io server disconnect") {
        setError("Servidor desconectado. Reconectando...")
      }
      console.log("Disconnected:", reason)
    }

    const handleReconnectAttempt = (attempt) => {
      setConnectionStatus(`Tentando reconectar (${attempt}/10)`)
      console.log(`Reconnection attempt ${attempt}`)
    }

    const handleReconnectFailed = () => {
      setConnectionStatus("Failed to reconnect")
      setError("Não foi possível reconectar ao servidor. Verifique sua conexão.")
      console.error("Reconnection failed")
    }

    socket.on("connect", handleConnect)
    socket.on("connect_error", handleConnectError)
    socket.on("disconnect", handleDisconnect)
    socket.on("reconnect_attempt", handleReconnectAttempt)
    socket.on("reconnect_failed", handleReconnectFailed)

    socket.on("users", (users) => {
      setOnlineUsers(users.filter((user) => user.name !== JSON.parse(rawUser).nome))
    })

    socket.on("offer", (data) => {
      console.log("Offer received from:", data.from)
      setIncomingOffer(data)
      setTargetUser(data.from)
      setIsCaller(false)
    })

    socket.on("answer", async (data) => {
      console.log("Answer received:", data)
      if (peerConnection.current) {
        try {
          const remoteDesc = new RTCSessionDescription(data.answer)
          await peerConnection.current.setRemoteDescription(remoteDesc)
          setConnectionProgress("Resposta recebida, estabelecendo conexão...")
        } catch (error) {
          console.error("Error setting remote description:", error)
          setError("Falha ao estabelecer conexão com o parceiro.")
          retryConnection()
        }
      }
    })

    socket.on("ice-candidate", async (data) => {
      if (peerConnection.current && data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          console.log("ICE candidate added successfully:", data.candidate.type)
        } catch (error) {
          console.error("Error adding ICE candidate:", error)
          // Não falha imediatamente, ICE candidates podem falhar individualmente
        }
      }
    })

    socket.on("end-call", () => {
      endCall()
    })

    socket.on("connection-retry", (data) => {
      console.log("Connection retry requested by peer")
      if (retryCount < maxRetries) {
        setTimeout(() => {
          retryConnection()
        }, 2000)
      }
    })

    socket.on("name-taken", (data) => {
      alert(data.message)
      socket.disconnect()
    })

    return () => {
      socket.off("connect", handleConnect)
      socket.off("connect_error", handleConnectError)
      socket.off("disconnect", handleDisconnect)
      socket.off("reconnect_attempt", handleReconnectAttempt)
      socket.off("reconnect_failed", handleReconnectFailed)
      socket.off("users")
      socket.off("offer")
      socket.off("answer")
      socket.off("ice-candidate")
      socket.off("end-call")
      socket.off("connection-retry")

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      endCall()
    }
  }, [])

  useEffect(() => {
    if (callInProgress) {
      timerRef.current = setInterval(() => {
        setCallTime((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      timerRef.current = null
      setCallTime(0)
    }

    return () => clearInterval(timerRef.current)
  }, [callInProgress])

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
    const secs = String(totalSeconds % 60).padStart(2, "0")
    return `${hrs}:${mins}:${secs}`
  }

  const setupPeerConnection = () => {
    try {
      // Configuração robusta para redes diferentes
      const pc = new RTCPeerConnection({
        iceServers: [
          // Múltiplos STUN servers para redundância
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },

          // TURN servers para NAT traversal complexo
          {
            urls: [
              "turn:relay1.expressturn.com:3478",
              "turn:relay1.expressturn.com:3479",
              "turn:relay1.expressturn.com:3480",
              "turn:relay1.expressturn.com:5349",
            ],
            username: "efJBIBF6DKX3L3",
            credential: "4vqg6qyENxmY9YTB",
          },
          // Backup TURN server
          {
            urls: [
              "turn:openrelay.metered.ca:80",
              "turn:openrelay.metered.ca:443",
              "turn:openrelay.metered.ca:443?transport=tcp",
            ],
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
        iceTransportPolicy: "all", // Permite todos os tipos de transporte
        iceCandidatePoolSize: 20, // Pool maior para redes diferentes
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
      })

      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })

      pc.onicecandidate = (event) => {
        if (event.candidate && targetUser) {
          console.log("Sending ICE candidate:", event.candidate.type, event.candidate.protocol)
          socket.emit("ice-candidate", {
            to: targetUser,
            candidate: event.candidate,
          })
        } else if (!event.candidate) {
          console.log("ICE gathering completed")
          setConnectionProgress("Coleta de candidatos finalizada")
        }
      }

      pc.ontrack = (event) => {
        console.log("Remote track received")
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0]
          setCallInProgress(true)
          setConnectionProgress("Conectado com sucesso!")
          setError(null)
        }
      }

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState
        console.log("ICE Connection State:", state)
        setIceConnectionState(state)

        switch (state) {
          case "new":
            setConnectionProgress("Iniciando conexão...")
            break
          case "checking":
            setConnectionProgress("Verificando conectividade entre redes...")
            break
          case "connected":
            setConnectionProgress("Conectado!")
            setError(null)
            setRetryCount(0)
            break
          case "completed":
            setConnectionProgress("Conexão estabelecida com sucesso!")
            break
          case "disconnected":
            setConnectionProgress("Conexão perdida, tentando reconectar...")
            if (retryCount < maxRetries) {
              setTimeout(() => retryConnection(), 3000)
            }
            break
          case "failed":
            setError("Falha na conexão P2P entre redes")
            if (retryCount < maxRetries) {
              setTimeout(() => retryConnection(), 5000)
            } else {
              setError("Não foi possível estabelecer conexão após várias tentativas")
            }
            break
          case "closed":
            setConnectionProgress("Conexão encerrada")
            break
        }
      }

      pc.onicegatheringstatechange = () => {
        const state = pc.iceGatheringState
        console.log("ICE gathering state:", state)
        setIceGatheringState(state)

        switch (state) {
          case "new":
            setConnectionProgress("Preparando conexão...")
            break
          case "gathering":
            setConnectionProgress("Coletando rotas de rede disponíveis...")
            break
          case "complete":
            setConnectionProgress("Rotas de rede identificadas")
            break
        }
      }

      pc.onnegotiationneeded = async () => {
        try {
          console.log("Negotiation needed")
          setConnectionProgress("Iniciando negociação entre redes...")

          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            iceRestart: retryCount > 0, // Reinicia ICE em tentativas subsequentes
          })

          await pc.setLocalDescription(offer)

          if (targetUser) {
            socket.emit("offer", {
              to: targetUser,
              offer: offer,
              from: socket.id,
              retry: retryCount,
            })
            setConnectionProgress("Oferta enviada, aguardando resposta...")
          }
        } catch (err) {
          console.error("Negotiation error:", err)
          setError("Erro na negociação de conexão")
          if (retryCount < maxRetries) {
            setTimeout(() => retryConnection(), 3000)
          }
        }
      }

      // Monitoramento de estatísticas da conexão
      const statsInterval = setInterval(async () => {
        if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
          try {
            const stats = await pc.getStats()
            stats.forEach((report) => {
              if (report.type === "candidate-pair" && report.state === "succeeded") {
                console.log("Active connection:", report.localCandidateId, "->", report.remoteCandidateId)
              }
            })
          } catch (error) {
            console.error("Error getting stats:", error)
          }
        }
      }, 10000)

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState)
        if (pc.connectionState === "closed" || pc.connectionState === "failed") {
          clearInterval(statsInterval)
        }
      }

      return pc
    } catch (error) {
      console.error("Error setting up peer connection:", error)
      setError(`Falha ao configurar conexão P2P: ${error.message}`)
      return null
    }
  }

  const retryConnection = async () => {
    if (retryCount >= maxRetries) {
      setError("Máximo de tentativas de reconexão atingido")
      return
    }

    setRetryCount((prev) => prev + 1)
    setConnectionProgress(`Tentativa de reconexão ${retryCount + 1}/${maxRetries}...`)

    // Limpa conexão anterior
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }

    // Notifica o peer sobre a tentativa de reconexão
    if (targetUser) {
      socket.emit("connection-retry", {
        to: targetUser,
        attempt: retryCount + 1,
      })
    }

    // Aguarda um pouco antes de tentar novamente
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Tenta novamente
    if (isCaller) {
      startCall()
    }
  }

  const startCall = async () => {
    if (!targetUser) {
      setError("Selecione um usuário para chamar")
      return
    }

    try {
      setIsCaller(true)
      setConnectionProgress("Iniciando chamada entre redes...")
      peerConnection.current = setupPeerConnection()

      // Timeout maior para redes diferentes
      const offerTimeout = setTimeout(() => {
        if (!callInProgress) {
          setError(`Tempo esgotado ao tentar conectar (tentativa ${retryCount + 1})`)
          if (retryCount < maxRetries) {
            retryConnection()
          } else {
            endCall()
          }
        }
      }, 45000) // 45 segundos para redes diferentes

      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: retryCount > 0,
      })

      await peerConnection.current.setLocalDescription(offer)

      socket.emit("offer", {
        to: targetUser,
        offer: offer,
        from: socket.id,
        retry: retryCount,
      })

      setError(null)
      clearTimeout(offerTimeout)
      setConnectionProgress("Chamada iniciada, estabelecendo conexão entre redes...")
    } catch (error) {
      console.error("Error starting call:", error)
      setError("Falha ao iniciar chamada")
      if (retryCount < maxRetries) {
        setTimeout(() => retryConnection(), 3000)
      } else {
        endCall()
      }
    }
  }

  const acceptCall = async () => {
    if (!incomingOffer) return

    try {
      setConnectionProgress("Aceitando chamada...")
      peerConnection.current = setupPeerConnection()

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer))

      const answer = await peerConnection.current.createAnswer()
      await peerConnection.current.setLocalDescription(answer)

      socket.emit("answer", {
        to: incomingOffer.from,
        answer: answer,
        from: socket.id,
      })

      setIncomingOffer(null)
      setError(null)
      setConnectionProgress("Resposta enviada, estabelecendo conexão...")
    } catch (error) {
      console.error("Error accepting call:", error)
      setError("Falha ao aceitar chamada")
      endCall()
    }
  }

  const endCall = (reason = "") => {
    // Notifica o outro participante
    if (targetUser && socket) {
      socket.emit("end-call", {
        to: targetUser,
        reason: reason,
      })
    }

    // Limpeza local
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }

    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      remoteVideoRef.current.srcObject = null
    }

    setCallInProgress(false)
    setIncomingOffer(null)
    setTargetUser(null)
    setIsCaller(false)
    setConnectionProgress("")
    setRetryCount(0)
    clearInterval(timerRef.current)
    setCallTime(0)
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoActive(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicActive(audioTrack.enabled)
      }
    }
  }

  const handleMouseDown = (e) => {
    setDragging(true)
    const rect = e.target.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging])

  return (
    <div className="videoconferencia-container">
      <video
        ref={localVideoRef}
        className={`me-video ${espelhar}`}
        autoPlay
        playsInline
        onMouseDown={handleMouseDown}
        style={{
          left: position.x,
          top: position.y,
          cursor: dragging ? "grabbing" : "grab",
        }}
        muted
      />

      <video
        ref={remoteVideoRef}
        className={`other-video ${espelhar}`}
        autoPlay
        playsInline
        style={{ display: callInProgress ? "block" : "none" }}
      />

      {!callInProgress && <img className="resposta.carre" src="/public/carregando.svg" alt="Waiting for call" />}

      {/* Indicador de progresso da conexão */}
      {connectionProgress && !callInProgress && (
        <div className="connection-progress">
          <p>{connectionProgress}</p>
          {retryCount > 0 && (
            <p className="retry-info">
              Tentativa {retryCount}/{maxRetries}
            </p>
          )}
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      )}

      {callInProgress && <div className="call-timer">{formatTime(callTime)}</div>}

      <div className={`barra-config-container ${configBarVisible ? "" : "hidden"}`}>
        <div className="barra-config">
          <div className="sair-button">
            <div className="sair-button-interno" onClick={() => navigate(-1)}>
              <img src="/public/seta-principal.svg" />
            </div>
          </div>

          <div className="ppp" onClick={toggleVideo} style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={!videoActive ? "/public/cam blue.svg" : "/public/cam grey.svg"}
              alt={videoActive ? "Video On" : "Video Off"}
            />
            <p style={{ color: videoActive ? "#BEBEBE" : "#5A7DA0" }}>Video</p>
          </div>

          <div className="ppp" onClick={toggleAudio} style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={!micActive ? "/public/audio blue.svg" : "/public/audio grey.svg"}
              alt={micActive ? "Mic On" : "Mic Off"}
            />
            <p style={{ color: micActive ? "#BEBEBE" : "#5A7DA0" }}>Audio</p>
          </div>

          <div
            className="ppp"
            onClick={() => setEspelhar(espelhar === "mirror" ? "" : "mirror")}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              src={espelhar !== "mirror" ? "/public/espelho blue 1.svg" : "/public/espelho grey.svg"}
              alt={espelhar === "mirror" ? "Mirror On" : "Mirror Off"}
            />
            <p style={{ color: espelhar === "mirror" ? "#BEBEBE" : "#5A7DA0" }}>Mirror</p>
          </div>

          {JSON.parse(rawUser).id_profissional && (
            <div
              className="ppp"
              onClick={() => setSalaDeEspera(salaDeEspera ? false : true)}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                src={salaDeEspera ? "/public/pacientes blue (2) 1.svg" : "/public/pacientes grey 1.svg"}
                alt={salaDeEspera ? "Sala de Espera Aberta" : "Sala de Espera Fechada"}
              />
              <p style={{ color: salaDeEspera ? "#5a7da0" : "#CFCFCF" }}>Pacientes</p>
            </div>
          )}

          <div
            className="ppp"
            onClick={() => setConfigBarVisible(false)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img src="/public/botao-fechar 1.svg" alt="Fechar Barra de Configurações" />
            <p style={{ color: "#CFCFCF" }}>Esconder</p>
          </div>
        </div>
      </div>

      {!configBarVisible && (
        <div className="ppp-2" onClick={() => setConfigBarVisible(true)}>
          <img src="/public/proximo 1.svg" />
        </div>
      )}

      {!callInProgress && !incomingOffer && JSON.parse(rawUser).id_profissional && targetUser && (
        <button className="start-call-button" onClick={startCall}>
          Iniciar Chamada
          <img src="/public/phone.png" />
        </button>
      )}

      {callInProgress && (
        <button style={{ backgroundColor: "#d30000" }} className="start-call-button" onClick={endCall}>
          Encerrar Chamada
          <img src="/public/phone.png" />
        </button>
      )}

      {incomingOffer && !callInProgress && (
        <div className="incoming-call">
          <button className="end-call-button" style={{ backgroundColor: "#d30000" }} onClick={endCall}>
            Recusar
          </button>
          <button className="accept-call-button" onClick={acceptCall}>
            Ingressar
          </button>
        </div>
      )}

      <div className={`users-online-container ${salaDeEspera ? "" : "hidden"}`}>
        <h4>Pacientes em espera ({onlineUsers.length})</h4>
        {onlineUsers.map((user) => (
          <div key={user.id} className="user-item">
            <span>{user.name?.split(" ")[0]}</span>
            <button
              onClick={() => (!targetUser ? setTargetUser(user.id) : setTargetUser(null))}
              disabled={callInProgress || incomingOffer}
              className={targetUser === user.id ? "select-name red" : "select-name"}
            >
              {targetUser === user.id ? "Remover" : "Adicionar"}
            </button>
          </div>
        ))}
      </div>

      {/* Debug info expandido */}
      <div
        className="debug-info"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "15px",
          fontSize: "11px",
          borderRadius: "8px",
          maxWidth: "350px",
        }}
      >
        <p>
          <strong>Socket:</strong> {connectionStatus}
        </p>
        <p>
          <strong>ICE State:</strong> {iceConnectionState}
        </p>
        <p>
          <strong>ICE Gathering:</strong> {iceGatheringState}
        </p>
        <p>
          <strong>Tentativas:</strong> {retryCount}/{maxRetries}
        </p>
        {error && (
          <p style={{ color: "#ff6b6b" }}>
            <strong>Erro:</strong> {error}
          </p>
        )}
        {connectionProgress && (
          <p style={{ color: "#51cf66" }}>
            <strong>Status:</strong> {connectionProgress}
          </p>
        )}
      </div>
    </div>
  )
}

export default VideoConferencia;