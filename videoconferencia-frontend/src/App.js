import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:5000");

const VideoConference = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  }));
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
  }, []);

  useEffect(() => {
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Enviando ICE candidate", event.candidate);
        socket.emit("ice-candidate", event.candidate);
      }
    };
    
    peerConnection.current.ontrack = (event) => {
      console.log("Recebendo stream remoto");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  }, []);

  useEffect(() => {
    socket.on("offer", async (offer) => {
      console.log("Recebendo oferta", offer);
      if (peerConnection.current.signalingState !== "stable") {
        console.warn("Ignorando oferta, conexão não estável");
        return;
      }
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      console.log("Recebendo resposta", answer);
      if (peerConnection.current.signalingState === "stable") {
        console.warn("Ignorando resposta, conexão já estabelecida");
        return;
      }
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        console.log("Adicionando candidato ICE", candidate);
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Erro ao adicionar candidato ICE:", error);
      }
    });
  }, []);

  const startCall = async () => {
    if (peerConnection.current.signalingState !== "stable") {
      console.warn("Chamada já em andamento");
      return;
    }
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    console.log("Enviando oferta", offer);
    socket.emit("offer", offer);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("chat-message", message);
    setChatMessages((prev) => [...prev, { text: message, sender: "me" }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setChatMessages((prev) => [...prev, { text: msg, sender: "other" }]);
    });
  }, []);

  const [clicked, setClicked] = useState(false);

  return (
    <div className="videoconferencia-container">
      <video onClick={() => setClicked(!clicked)} className={!clicked ? 'me-video' : 'other-video'} ref={!clicked ? localVideoRef : remoteVideoRef} autoPlay playsInline muted></video>
      <video onClick={() => setClicked(!clicked)} className={!clicked ? 'other-video' : 'me-video'} ref={!clicked ? localVideoRef : remoteVideoRef} autoPlay playsInline></video>
      <button onClick={startCall}>Iniciar Chamada</button>
      <div className='chat-live'>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
      <div>
        {chatMessages.map((msg, index) => (
          <p key={index} style={{ color: msg.sender === "me" ? "blue" : "red" }}>{msg.text}</p>
        ))}
      </div>
    </div>
  );
};

export default VideoConference;