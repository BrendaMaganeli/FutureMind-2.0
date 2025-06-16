import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./CSS/Call.css";

const socket = io('https://futuremind-20-production.up.railway.app', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

function VideoConferencia2() {
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

  // State
  const [videoActive, setVideoActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [callInProgress, setCallInProgress] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [espelhar, setEspelhar] = useState('mirror');
  const [isCaller, setIsCaller] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 1100, y: 20 });
  const [callTime, setCallTime] = useState(0);

  // Configuração dos servidores ICE
  const iceServers = {
    iceServers: [
      {
        urls: "turn:relay1.expressturn.com:3478",
        username: "000000002065129162",
        credential: "vCxR0rq7wtXcOLu30ME4BD4mhmE=",
      },
      {
        urls: "turn:numb.viagenie.ca",
        username: "webrtc@live.com",
        credential: "muazkh",
      },
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };

  // Inicializa mídia e conexão socket
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setError("Não foi possível acessar câmera/microfone. Verifique as permissões.");
      }
    };

    initializeMedia();

    // Socket.IO event handlers
    const handleConnect = () => {
      setConnectionStatus("Connected");
      setError(null);
      console.log("Conectado ao servidor Socket.IO");
    };

    const handleConnectError = (err) => {
      setConnectionStatus("Connection Failed");
      setError(`Falha na conexão: ${err.message}`);
      console.error("Connection error:", err);
    };

    const handleDisconnect = (reason) => {
      setConnectionStatus("Disconnected");
      if (reason === "io server disconnect") {
        setError("Servidor desconectado. Reconectando...");
      }
      console.log("Disconnected:", reason);
    };

    // WebRTC Signaling Handlers
    socket.on("users", (users) => {
      setOnlineUsers(users.filter(u => u !== socket.id));
    });

    socket.on("offer", (data) => {
      console.log("Offer received from:", data.from);
      setIncomingOffer(data);
      setTargetUser(data.from);
      setIsCaller(false);
    });

    socket.on("answer", async (data) => {
      console.log("Answer received:", data);
      if (peerConnection.current) {
        try {
          const remoteDesc = new RTCSessionDescription(data.answer);
          await peerConnection.current.setRemoteDescription(remoteDesc);
          setCallInProgress(true);
          setError(null);
        } catch (error) {
          console.error("Error setting remote description:", error);
          setError("Falha ao estabelecer conexão com o parceiro.");
        }
      }
    });

    socket.on("ice-candidate", async (data) => {
      if (peerConnection.current && data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log("ICE Candidate added successfully:", data.candidate);
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("users");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      endCall();
    };
  }, []);

  // Timer da chamada
  useEffect(() => {
    if (callInProgress) {
      timerRef.current = setInterval(() => setCallTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setCallTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callInProgress]);

  // Configura a conexão WebRTC
  const setupPeerConnection = () => {
    try {
      const pc = new RTCPeerConnection(iceServers);

      // Adiciona stream local
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });

      // Eventos de ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && targetUser) {
          socket.emit("ice-candidate", {
            to: targetUser,
            candidate: event.candidate,
          });
          console.log("ICE Candidate generated:", event.candidate);
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Depuração de estados ICE
      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed") {
          setError("Falha na conexão ICE. Tentando usar TURN...");
        }
      };

      pc.onicegatheringstatechange = () => {
        console.log("ICE Gathering State:", pc.iceGatheringState);
      };

      return pc;
    } catch (error) {
      console.error("Error setting up peer connection:", error);
      setError("Falha ao configurar conexão P2P");
      return null;
    }
  };

  // Inicia chamada
  const startCall = async () => {
    if (!targetUser) {
      setError("Selecione um usuário para chamar");
      return;
    }

    try {
      setIsCaller(true);
      peerConnection.current = setupPeerConnection();
      
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", {
        to: targetUser,
        offer: offer,
        from: socket.id,
      });

      setCallInProgress(true);
      setError(null);
    } catch (error) {
      console.error("Error starting call:", error);
      setError("Falha ao iniciar chamada");
      endCall();
    }
  };

  // Aceita chamada
  const acceptCall = async () => {
    if (!incomingOffer) return;

    try {
      peerConnection.current = setupPeerConnection();
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(incomingOffer.offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", {
        to: incomingOffer.from,
        answer: answer,
        from: socket.id,
      });

      setCallInProgress(true);
      setIncomingOffer(null);
      setError(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      setError("Falha ao aceitar chamada");
      endCall();
    }
  };

  // Finaliza chamada
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    
    setCallInProgress(false);
    setIncomingOffer(null);
    setTargetUser(null);
    setIsCaller(false);
    setCallTime(0);
  };

  // Controles de mídia
  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoActive(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicActive(audioTrack.enabled);
    }
  };

  // Drag and drop da janela de vídeo local
  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = e.target.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Formata tempo da chamada (HH:MM:SS)
  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="videoconferencia-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="connection-status">
        Status: {connectionStatus}
      </div>

      <video 
        ref={localVideoRef} 
        className={`me-video ${espelhar}`} 
        autoPlay 
        playsInline 
        onMouseDown={handleMouseDown}
        style={{
          left: position.x,
          top: position.y,
          cursor: dragging ? "grabbing" : "grab"
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

      {!callInProgress && (
        <img
          className="resposta-carre"
          src="/public/carregando.svg"
          alt="Waiting for call"
        />
      )}

      {callInProgress && (
        <div className="call-timer">
          {formatTime(callTime)}
        </div>
      )}

      <div className="barra-config">
        {callInProgress ? (
          <img src="/public/phone.png" alt="End call" onClick={endCall} />
        ) : null}
        
        <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
          <img
            onClick={toggleVideo}
            src={videoActive ? "/public/video-active.png" : "/public/video-desactive.png"}
            alt={videoActive ? "Video On" : "Video Off"}
          />
          <p style={{ color: videoActive ? "white" : "#013a63" }}>Video</p>
        </div>
        
        <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
          <img
            onClick={toggleAudio}
            src={micActive ? "/public/mic.png" : "/public/mute.png"}
            alt={micActive ? "Mic On" : "Mic Off"}
          />
          <p style={{ color: micActive ? "white" : "#013a63" }}>Audio</p>
        </div>
        
        <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
          <img
            onClick={() => setEspelhar(espelhar === 'mirror' ? '' : 'mirror')}
            src={espelhar === 'mirror' ? "/public/espelho 1.svg" : "/public/espelho (1) 1.svg"}
            alt={espelhar === 'mirror' ? "Mirror On" : "Mirror Off"}
          />
          <p style={{ color: espelhar === 'mirror' ? "white" : "#013a63" }}>Mirror</p>
        </div>
      </div>

      {!callInProgress && !incomingOffer && (
        <button className="start-call-button" onClick={startCall}>
          Start Call
        </button>
      )}

      {incomingOffer && !callInProgress && (
        <div className="incoming-call">
          <button className="end-call-button" onClick={endCall}>
            Decline
          </button>
          <button className="accept-call-button" onClick={acceptCall}>
            Accept Call
          </button>
        </div>
      )}

      <div className="users-online-container">
        <h4>Online Users ({onlineUsers.length})</h4>
        {onlineUsers.map((user) => (
          <div key={user} className="user-item">
            <span>ID: {user}</span>
            <button
              onClick={() => setTargetUser(user)}
              disabled={callInProgress || incomingOffer}
            >
              {targetUser === user ? "Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoConferencia2;