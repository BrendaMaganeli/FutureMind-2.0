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

    socket = io("http://192.168.86.96:5000", {
      auth: {
        name: user?.nome,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000, // Reduzido para 5 segundos
      transports: ["websocket", "polling"], // Adicionado polling como fallback
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

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30, max: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
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
      setConnectionStatus(`Tentando reconectar (${attempt}/5)`)
      console.log(`Reconnection attempt ${attempt}`)
    }

    const handleReconnectFailed = () => {
      setConnectionStatus("Failed to reconnect")
      setError("Não foi possível reconectar ao servidor. Recarregue a página.")
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
          setCallInProgress(true)
          setError(null)
          setConnectionProgress("Conectado!")
        } catch (error) {
          console.error("Error setting remote description:", error)
          setError("Falha ao estabelecer conexão com o parceiro.")
        }
      }
    })

    socket.on("ice-candidate", async (data) => {
      if (peerConnection.current && data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          console.log("ICE candidate added successfully")
        } catch (error) {
          console.error("Error adding ICE candidate:", error)
        }
      }
    })

    socket.on("end-call", () => {
      endCall()
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
      // Configuração otimizada para redes locais
      const pc = new RTCPeerConnection({
        iceServers: [
          // Primeiro tenta conexão direta (mais rápido para redes locais)
          { urls: "stun:stun.l.google.com:19302" },
          // Backup TURN servers
          {
            urls: ["turn:relay1.expressturn.com:3480", "turn:relay1.expressturn.com:3480"],
            username: "000000002065129162",
            credential: "vCxR0rq7wtXcOLu30ME4BD4mhmE=",
          },
        ],
        iceTransportPolicy: "all",
        iceCandidatePoolSize: 10, // Aumenta o pool de candidatos
        bundlePolicy: "max-bundle", // Otimiza o bundle
        rtcpMuxPolicy: "require", // Força multiplexing
      })

      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })

      pc.onicecandidate = (event) => {
        if (event.candidate && targetUser) {
          console.log("Sending ICE candidate:", event.candidate.type)
          socket.emit("ice-candidate", {
            to: targetUser,
            candidate: event.candidate,
          })
        } else if (!event.candidate) {
          console.log("ICE gathering completed")
          setConnectionProgress("Finalizando conexão...")
        }
      }

      pc.ontrack = (event) => {
        console.log("Remote track received")
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0]
          setConnectionProgress("Stream remoto conectado!")
        }
      }

      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState)
        setConnectionProgress(`Estado da conexão: ${pc.iceConnectionState}`)

        switch (pc.iceConnectionState) {
          case "checking":
            setConnectionProgress("Verificando conectividade...")
            break
          case "connected":
            setConnectionProgress("Conectado!")
            setError(null)
            break
          case "completed":
            setConnectionProgress("Conexão estabelecida!")
            break
          case "disconnected":
            setConnectionProgress("Conexão perdida, tentando reconectar...")
            break
          case "failed":
            setError("Falha na conexão P2P")
            break
        }
      }

      pc.onicegatheringstatechange = () => {
        console.log("ICE gathering state:", pc.iceGatheringState)
        setIceGatheringState(pc.iceGatheringState)

        switch (pc.iceGatheringState) {
          case "gathering":
            setConnectionProgress("Coletando informações de rede...")
            break
          case "complete":
            setConnectionProgress("Informações de rede coletadas")
            break
        }
      }

      pc.onnegotiationneeded = async () => {
        try {
          console.log("Negotiation needed")
          setConnectionProgress("Iniciando negociação...")

          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          })

          await pc.setLocalDescription(offer)

          if (targetUser) {
            socket.emit("offer", {
              to: targetUser,
              offer: offer,
              from: socket.id,
            })
            setConnectionProgress("Oferta enviada, aguardando resposta...")
          }
        } catch (err) {
          console.error("Negotiation error:", err)
          setError("Erro na negociação de conexão")
        }
      }

      return pc
    } catch (error) {
      console.error("Error setting up peer connection:", error)
      setError(`Falha ao configurar conexão P2P: ${error.message}`)
      return null
    }
  }

  const startCall = async () => {
    if (!targetUser) {
      setError("Selecione um usuário para chamar")
      return
    }

    try {
      setIsCaller(true)
      setConnectionProgress("Iniciando chamada...")
      peerConnection.current = setupPeerConnection()

      // Timeout reduzido para redes locais
      const offerTimeout = setTimeout(() => {
        if (!callInProgress) {
          setError("Tempo esgotado ao tentar conectar (10s)")
          endCall()
        }
      }, 10000) // Reduzido para 10 segundos

      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

      await peerConnection.current.setLocalDescription(offer)

      socket.emit("offer", {
        to: targetUser,
        offer: offer,
        from: socket.id,
      })

      setCallInProgress(true)
      setError(null)
      clearTimeout(offerTimeout)
      setConnectionProgress("Chamada iniciada, aguardando resposta...")
    } catch (error) {
      console.error("Error starting call:", error)
      setError("Falha ao iniciar chamada")
      endCall()
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

      setCallInProgress(true)
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

      {/* Debug info */}
      <div
        className="debug-info"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px",
          fontSize: "12px",
        }}
      >
        <p>Status: {connectionStatus}</p>
        <p>ICE State: {iceGatheringState}</p>
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
      </div>
    </div>
  )
}

export default VideoConferencia