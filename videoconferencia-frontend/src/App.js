import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:5000");

const VideoConference = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        peerConnection.current = new RTCPeerConnection();
        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
  }, []);
  

  const sendMessage = () => {
    socket.emit("chat-message", message);
    setChatMessages((prev) => [...prev, { text: message, sender: "me" }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setChatMessages((prev) => [...prev, { text: msg, sender: "other" }]);
    });
  }, []);

  const activeCamera = () => {

    const stateUptated = !active
    setActive(stateUptated);

    if (stateUptated) {

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        peerConnection.current = new RTCPeerConnection();
        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
    }
  }

  return (
    <div className="videoconferencia-container">
      {
        active
        ?
        <video className='me-video' ref={localVideoRef} autoPlay playsInline></video>
        :
        <div className='video-paused'>
          <img src='off.png' />
        </div>
      }
      <video className='other-video' ref={remoteVideoRef} autoPlay playsInline></video>

      <div className="barra-config">
        {
          active
          ?
          <img src='video-desactive.png' onClick={activeCamera} />
          :
          <img src='video-active.svg' onClick={activeCamera} />
        }
      </div>
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