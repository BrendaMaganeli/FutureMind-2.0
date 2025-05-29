import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./CSS/Call.css";

const socket = io("http://localhost:5000");

const VideoConferencia = () => {
  const [videoActive, setVideoActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [chatActive, setChatActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [offer, setOffer] = useState(null);
  const [userId, setUserId] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setUserId(socket.id);
      socket.emit("get-users");
    });

    socket.on("users", (users) => {
      setOnlineUsers(users.filter((u) => u !== socket.id));
    });

    socket.on("offer", handleIncomingOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      endCall();
    };
  }, []);

  const initializePeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && targetUser) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: targetUser,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current
          .play()
          .catch((err) => console.error("Erro ao reproduzir vídeo:", err));
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnection.current = pc;
  };

  const handleIncomingOffer = async ({ offer, from }) => {
    setTargetUser(from);
    setOffer({ offer, from });
  };

  const handleAnswer = async (answer) => {
    if (!peerConnection.current) return;
    try {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Erro ao definir resposta remota:", error);
    }
  };

  const handleIceCandidate = async ({ candidate }) => {
    if (peerConnection.current && candidate) {
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("Erro ao adicionar ICE candidate:", err);
      }
    }
  };

  const startCall = async () => {
    if (!targetUser) {
      alert("Selecione um usuário da lista abaixo antes de chamar");
      return;
    }

    try {
      initializePeerConnection();

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", {
        offer,
        to: targetUser,
        from: userId,
      });

      setCallInProgress(true);
    } catch (error) {
      console.error("Erro ao iniciar chamada:", error);
      alert("Erro ao iniciar chamada");
    }
  };

  const acceptOffer = async () => {
    if (!offer) return;

    try {
      initializePeerConnection();

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer.offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", {
        answer,
        to: offer.from,
      });

      setCallInProgress(true);
      setOffer(null);
    } catch (error) {
      console.error("Erro ao aceitar chamada:", error);
      alert("Erro ao aceitar chamada");
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    setCallInProgress(false);
    setTargetUser(null);
    setOffer(null);
  };

  const [chatSelected, setChatSelected] = useState({
    foto: "img.conversa.chat.png",
    nome: "Jana Maria",
  });
  const settingsRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [inptvalue, setInptvalue] = useState("");
  const [name, setName] = useState("");
  const [espelhar, setEspelhar] = useState("mirror");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setVisibleSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="videoconferencia-container">
      <video
        onClick={() => setClicked(!clicked)}
        ref={!clicked ? localVideoRef : remoteVideoRef}
        className={
          !clicked ? `me-video ${espelhar}` : `other-video ${espelhar}`
        }
        autoPlay
        playsInline
        muted
      />
      {clicked ? (
        <video
          ref={!clicked ? remoteVideoRef : localVideoRef}
          className={
            !clicked ? `other-video ${espelhar}` : `me-video ${espelhar}`
          }
          autoPlay
          playsInline
        />
      ) : (
        <img
          className="resposta.carre"
          src="/public/carre-resposta.svg"
          alt="Aguardando chamada"
        />
      )}

      {!callInProgress && !offer && (
        <button className="start-call-button" onClick={startCall}>
          Iniciar Chamada
        </button>
      )}

      {offer && (
        <div className="incoming-call">
          <button className="end-call-button" onClick={endCall}>
            Recusar
          </button>
          <button className="start-call-button" onClick={acceptOffer}>
            Aceitar Chamada
          </button>
        </div>
      )}

      {callInProgress && (
        <button className="end-call-button" onClick={endCall}>
          Encerrar Chamada
        </button>
      )}

      {/* Barra de configurações (original) */}
      <div className="barra-config">
        <img src="/public/phone.png" alt="Telefone" onClick={endCall} />
        {videoActive ? (
          <div
            className="ppp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              onClick={() => setVideoActive(!videoActive)}
              src="/public/video-active.png"
              alt="Vídeo Ativo"
            />
            <p style={{ color: "white" }}>Vídeo</p>
          </div>
        ) : (
          <div
            className="ppp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              onClick={() => setVideoActive(!videoActive)}
              src="/public/video-desactive.png"
              alt="Vídeo Desativado"
            />
            <p style={{ color: "#013a63" }}>Vídeo</p>
          </div>
        )}
        {micActive ? (
          <div
            className="ppp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              onClick={() => setMicActive(!micActive)}
              src="/public/mic.png"
              alt="Microfone Ativo"
            />
            <p style={{ color: "white" }}>Áudio</p>
          </div>
        ) : (
          <div
            className="ppp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              onClick={() => setMicActive(!micActive)}
              src="/public/mute.png"
              alt="Microfone Mutado"
            />
            <p style={{ color: "#013a63" }}>Áudio</p>
          </div>
        )}
        {espelhar === "mirror" ? (
          <div
            className="ppp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              onClick={() => setEspelhar("")}
              src="/public/espelho 1.svg"
              alt="Espelhar"
            />
            <p style={{ color: "white" }}>Espelhar</p>
          </div>
        ) : (
          <div
            className="ppp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              onClick={() => setEspelhar("mirror")}
              src="/public/espelho (1) 1.svg"
              alt="Não Espelhar"
            />
            <p style={{ color: "#013a63" }}>Espelhar</p>
          </div>
        )}
      </div>

      {/* Lista de usuários online (original) */}
      <div className="users-online-container">
        <h4>Usuários Online</h4>
        {onlineUsers.map((user) => (
          <div key={user} className="user-item">
            <span>ID: {user}</span>
            <button
              onClick={() => setTargetUser(user)}
              disabled={callInProgress || (offer && offer.from === user)}
            >
              {targetUser === user ? "Selecionado" : "Selecionar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoConferencia;
