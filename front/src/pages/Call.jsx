import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './CSS/Call.css';

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
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [myId, setMyId] = useState(null);

  const initializePeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && selectedUser) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: selectedUser,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        initializePeerConnection();
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
  }, []);

  useEffect(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = videoActive;
    }
  }, [videoActive]);

  useEffect(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = micActive;
    }
  }, [micActive]);

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });

    socket.on("users", (userList) => {
      setUsers(userList.filter((id) => id !== socket.id));
    });

    socket.on("offer", async ({ offer, from }) => {
      setOffer({ offer, from });
    });

    socket.on("answer", async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Erro ICE:", err);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const startCall = async (userId) => {
    if (callInProgress) {
      alert("Chamada já em andamento.");
      return;
    }
    initializePeerConnection();
    setSelectedUser(userId);
    setCallInProgress(true);
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { offer, to: userId });
  };

  const acceptOffer = async () => {
    if (!offer) return;
    const { offer: receivedOffer, from } = offer;
    setSelectedUser(from);
    initializePeerConnection();
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(receivedOffer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { answer, to: from });
    setCallInProgress(true);
    setOffer(null);
  };

  return (
    <div className="videoconferencia-container">
      <video 
        onClick={() => setClicked(!clicked)} 
        ref={localVideoRef} 
        className={clicked ? `other-video mirror` : `me-video mirror`} 
        autoPlay 
        playsInline 
        muted 
      />
      {clicked ? (
        <video 
          ref={remoteVideoRef} 
          className={`me-video mirror`} 
          autoPlay 
          playsInline 
        />
      ) : (
        <img src="carre-resposta.svg" className="resposta.carre" />
      )}

      {!callInProgress && (
        <div>
          <h3>Usuários Disponíveis:</h3>
          {users.map((userId) => (
            <button key={userId} onClick={() => startCall(userId)}>Chamar {userId}</button>
          ))}
        </div>
      )}

      {offer && <button className="start-call-button" onClick={acceptOffer}>Aceitar Chamada</button>}
    </div>
  );
};

export default VideoConferencia;