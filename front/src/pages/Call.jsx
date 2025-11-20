import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./CSS/Call.css";

function VideoConferencia() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [videoActive, setVideoActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [callInProgress, setCallInProgress] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [configBarVisible, setConfigBarVisible] = useState(true);
  const [espelhar, setEspelhar] = useState("mirror");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 1245, y: 40 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef(null);
  const [iceGatheringState, setIceGatheringState] = useState("");
  const [salaDeEspera, setSalaDeEspera] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        setError("Não foi possível acessar câmera/microfone. Verifique as permissões.");
      }
    };
    initializeMedia();
  }, []);

  useEffect(() => {
    const rawUser = localStorage.getItem("User-Profile");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const wakeupAndConnect = async () => {
      try {
        await fetch("https://futuremind-2-0-2.onrender.com/");
      } catch (e) {}
      const s = io("https://futuremind-2-0-2.onrender.com", {
        auth: { name: user?.nome || user?.name || "unknown" },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket", "polling"]
      });
      setSocket(s);

      s.on("connect", () => {
        setConnectionStatus("Connected");
        console.log("SOCKET CONNECTED", s.id);
      });

      s.on("connect_error", (err) => {
        setConnectionStatus("Connection Failed");
        console.log("SOCKET CONNECT_ERROR", err);
        setError(`Falha na conexão: ${err.message || err}`);
      });

      s.on("disconnect", (reason) => {
        setConnectionStatus("Disconnected");
        console.log("SOCKET DISCONNECTED", reason);
        if (reason === "io server disconnect") {
          setError("Servidor desconectado. Reconectando...");
        }
      });

      s.on("reconnect_attempt", (attempt) => {
        setConnectionStatus(`Tentando reconectar (${attempt}/5)`);
      });

      s.on("reconnect_failed", () => {
        setConnectionStatus("Failed to reconnect");
        setError("Não foi possível reconectar ao servidor. Recarregue a página.");
      });

      s.on("users", (users) => {
        console.log("USERS RECEBIDOS", users);
        try {
          const selfId = s.id;
          const filtered = Array.isArray(users) ? users.filter(u => u.id !== selfId) : users;
          setOnlineUsers(filtered);
        } catch {
          setOnlineUsers(users);
        }
      });

      s.on("offer", (data) => {
        console.log("OFFER RECEIVED", data);
        setIncomingOffer(data);
        setTargetUser(data.from);
      });

      s.on("answer", async (data) => {
        console.log("ANSWER RECEIVED", data);
        if (peerConnection.current) {
          try {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            setCallInProgress(true);
            setError(null);
          } catch (e) {
            setError("Falha ao estabelecer conexão com o parceiro.");
          }
        }
      });

      s.on("ice-candidate", async (data) => {
        console.log("ICE CANDIDATE RECEIVED", data);
        if (peerConnection.current && data.candidate) {
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            setError("Falha ao adicionar ICE candidate.");
          }
        }
      });

      s.on("name-taken", (data) => {
        alert(data.message);
        s.disconnect();
      });

      s.on("call-ended", (data) => {
        if (!data || !data.to || data.to === s.id) {
          endCall("");
        }
      });
    };

    wakeupAndConnect();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (callInProgress) {
      timerRef.current = setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setCallTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callInProgress]);

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

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleIceCandidateEvent = (event) => {
    if (event.candidate) {
      if (targetUser && socket) {
        socket.emit("ice-candidate", {
          to: targetUser,
          candidate: event.candidate
        });
      }
    }
  };

  const handleTrackEvent = (event) => {
    if (event.streams && event.streams[0]) {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(() => {});
      }
    }
  };

  const handleIceConnectionStateChange = () => {
    const pc = peerConnection.current;
    if (!pc) return;
    if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
      setError("Problema na conexão. Tentando reconectar...");
      setTimeout(() => {
        if (callInProgress) {
          startCall();
        }
      }, 2000);
    }
  };

  const handleIceGatheringStateChange = () => {
    if (peerConnection.current) {
      setIceGatheringState(peerConnection.current.iceGatheringState);
    }
  };

  const handleNegotiationNeeded = async () => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      if (targetUser && socket) {
        socket.emit("offer", {
          to: targetUser,
          offer,
          from: socket.id
        });
      }
    } catch {
      setError("Erro na negociação de conexão");
    }
  };

  const handleConnectionStateChange = () => {
    if (!peerConnection.current) return;
    if (peerConnection.current.connectionState === "disconnected" || peerConnection.current.connectionState === "failed") {
      setError("Conexão perdida. Tentando reconectar...");
      setTimeout(() => {
        if (callInProgress) {
          endCall();
          startCall();
        }
      }, 2000);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const setupPeerConnection = () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
          { urls: ["turn:relay1.expressturn.com:3478"], username: "000000002065129162", credential: "vCxR0rq7wtXcOLu30ME4BD4mhmE=" }
        ],
        iceTransportPolicy: "all"
      });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pc.onicecandidate = handleIceCandidateEvent;
      pc.ontrack = handleTrackEvent;
      pc.oniceconnectionstatechange = handleIceConnectionStateChange;
      pc.onicegatheringstatechange = handleIceGatheringStateChange;
      pc.onnegotiationneeded = handleNegotiationNeeded;
      pc.onconnectionstatechange = handleConnectionStateChange;

      return pc;
    } catch (error) {
      setError("Falha ao configurar conexão P2P");
      return null;
    }
  };

  const startCall = async () => {
    if (!targetUser) {
      setError("Selecione um usuário para chamar");
      return;
    }
    if (!socket) {
      setError("Socket não conectado");
      return;
    }

    let offerTimeout;
    let iceTimeout;

    try {
      peerConnection.current = setupPeerConnection();
      showNotification("Solicitação enviada");
      setOfferSent(true);

      offerTimeout = setTimeout(() => {
        if (!callInProgress) {
          setError("Tempo esgotado ao tentar conectar");
          endCall();
        }
      }, 30000);

      iceTimeout = setTimeout(() => {
        if (peerConnection.current && peerConnection.current.iceConnectionState !== "connected" && peerConnection.current.iceConnectionState !== "completed") {
          setError("Não foi possível conectar ao parceiro. Tentando novamente...");
          endCall();
          setTimeout(() => {
            if (!callInProgress) {
              startCall();
            }
          }, 2000);
        }
      }, 15000);

      const offer = await peerConnection.current.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 });
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", { to: targetUser, offer, from: socket.id });

      setError(null);

      clearTimeout(offerTimeout);
      clearTimeout(iceTimeout);
    } catch (error) {
      clearTimeout(offerTimeout);
      clearTimeout(iceTimeout);
      setError("Falha ao iniciar chamada");
      endCall();
    }
  };

  const acceptCall = async () => {
    if (!incomingOffer || !socket) return;

    try {
      peerConnection.current = setupPeerConnection();
      showNotification("Chamada iniciada");
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", { to: incomingOffer.from, answer, from: socket.id });
      setCallInProgress(true);
      setIncomingOffer(null);
      setError(null);
    } catch {
      setError("Falha ao aceitar chamada");
      endCall();
    }
  };

  const endCall = (reason = "") => {
    if (targetUser && socket) {
      socket.emit("end-call", { to: targetUser, from: socket.id });
    }

    showNotification("Chamada encerrada");

    if (peerConnection.current) {
      peerConnection.current.ontrack = null;
      peerConnection.current.onicecandidate = null;
      peerConnection.current.oniceconnectionstatechange = null;
      peerConnection.current.onnegotiationneeded = null;
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    setCallInProgress(false);
    setOfferSent(false);
    setIncomingOffer(null);
    setTargetUser(null);
    clearInterval(timerRef.current);
    setCallTime(0);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoActive(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
      }
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = e.target.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="videoconferencia-container">
      <video
        ref={localVideoRef}
        className={`me-video ${espelhar}`}
        autoPlay
        playsInline
        onMouseDown={handleMouseDown}
        style={{ left: position.x, top: position.y, cursor: dragging ? "grabbing" : "grab" }}
        muted
      />

      <video
        ref={remoteVideoRef}
        className={`other-video ${espelhar}`}
        autoPlay
        playsInline
        style={{ display: callInProgress ? "block" : "none" }}
      />

      {!callInProgress && <img className="resposta.carre" src="/carregando.svg" alt="Waiting for call" />}

      {callInProgress && <div className="call-timer">{formatTime(callTime)}</div>}

      <div className={`barra-config-container ${configBarVisible ? "" : "hidden"}`}>
        <div className="barra-config">
          <div className="sair-button">
            <div className="sair-button-interno" onClick={() => navigate(-1)}>
              <img src="/seta-principal.svg" />
            </div>
          </div>

          <div className="ppp" onClick={toggleVideo} style={{ display: "flex", flexDirection: "column" }}>
            <img src={!videoActive ? "/cam blue.svg" : "/cam grey.svg"} alt={videoActive ? "Video On" : "Video Off"} />
            <p style={{ color: videoActive ? "#BEBEBE" : "#5A7DA0" }}>Video</p>
          </div>

          <div className="ppp" onClick={toggleAudio} style={{ display: "flex", flexDirection: "column" }}>
            <img src={!micActive ? "/audio blue.svg" : "/audio grey.svg"} alt={micActive ? "Mic On" : "Mic Off"} />
            <p style={{ color: micActive ? "#BEBEBE" : "#5A7DA0" }}>Audio</p>
          </div>

          <div className="ppp" onClick={() => setEspelhar(espelhar === "mirror" ? "" : "mirror")} style={{ display: "flex", flexDirection: "column" }}>
            <img src={espelhar !== "mirror" ? "/espelho blue 1.svg" : "/espelho grey.svg"} alt={espelhar === "mirror" ? "Mirror On" : "Mirror Off"} />
            <p style={{ color: espelhar === "mirror" ? "#BEBEBE" : "#5A7DA0" }}>Mirror</p>
          </div>

          {JSON.parse(localStorage.getItem("User-Profile") || "{}")?.id_profissional && (
            <div className="ppp" onClick={() => setSalaDeEspera(!salaDeEspera)} style={{ display: "flex", flexDirection: "column" }}>
              <img src={salaDeEspera ? "/pacientes blue (2) 1.svg" : "/pacientes grey 1.svg"} alt={salaDeEspera ? "Sala de Espera Aberta" : "Sala de Espera Fechada"} />
              <p style={{ color: salaDeEspera ? "#5a7da0" : "#CFCFCF" }}>Pacientes</p>
            </div>
          )}

          <div className="ppp" onClick={() => setConfigBarVisible(false)} style={{ display: "flex", flexDirection: "column" }}>
            <img src="/botao-fechar 1.svg" alt="Fechar Barra de Configurações" />
            <p style={{ color: "#CFCFCF" }}>Esconder</p>
          </div>
        </div>
      </div>

      {!configBarVisible && (
        <div className="ppp-2" onClick={() => setConfigBarVisible(true)}>
          <img src="/proximo 1.svg" />
        </div>
      )}

      {!callInProgress && !incomingOffer && JSON.parse(localStorage.getItem("User-Profile") || "{}")?.id_profissional && targetUser && (
        <button className={!offerSent ? "start-call-button" : "requested-call-button"} onClick={!offerSent ? startCall : undefined}>
          {offerSent ? "Chamada solicitada" : "Iniciar Chamada"}
          <img src="/phone.png" />
        </button>
      )}

      {callInProgress && (
        <button style={{ backgroundColor: "#d30000" }} className="start-call-button" onClick={() => endCall("")}>
          Encerrar Chamada
          <img src="/phone.png" />
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
            <button onClick={() => (!targetUser ? setTargetUser(user.id) : setTargetUser(null))} disabled={callInProgress || incomingOffer} className={targetUser === user.id ? "select-name red" : "select-name"}>
              {targetUser === user.id ? "Remover" : "Adicionar"}
            </button>
          </div>
        ))}
      </div>
      {notification && <div className={notification === "Chamada encerrada" ? `notification-modal-end-call` : "notification-modal"}><span>{notification}</span></div>}
    </div>
  );
}

export default VideoConferencia;
