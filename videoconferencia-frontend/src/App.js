import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:5000");

const VideoConference = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [offer, setOffer] = useState(null);

  const initializePeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
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
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        initializePeerConnection();
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
  }, []);

  useEffect(() => {
    socket.on("offer", async (receivedOffer) => {
      console.log("Oferta recebida:", receivedOffer);
      setOffer(receivedOffer);
    });

    socket.on("answer", async (answer) => {
      if (!peerConnection.current || peerConnection.current.signalingState === "stable") return;
      console.log("Resposta recebida:", answer);
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        if (peerConnection.current) {
          console.log("Candidato ICE recebido:", candidate);
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error("Erro ao adicionar candidato ICE:", error);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const startCall = async () => {
    if (callInProgress) {
      alert("A chamada já está em andamento.");
      return;
    }
    initializePeerConnection();
    setCallInProgress(true);
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    console.log("Enviando oferta:", offer);
    socket.emit("offer", offer);
  };

  const acceptOffer = async () => {
    if (!offer) return;
    console.log("Aceitando oferta:", offer);
    initializePeerConnection();
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    console.log("Enviando resposta:", answer);
    socket.emit("answer", answer);
    setOffer(null);
    setCallInProgress(true);
  };

  const [videoActive, setVideoActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [chatActive, setChatActive] = useState(false);

  return (
    <div className="videoconferencia-container">
      
      <video onClick={() => setClicked(!clicked)} ref={!clicked ? localVideoRef : remoteVideoRef} className={!clicked ? 'me-video' : 'other-video'} autoPlay playsInline muted />
      <video onClick={() => setClicked(!clicked)} ref={!clicked ? remoteVideoRef : localVideoRef} className={!clicked ? 'other-video' : 'me-video'} autoPlay playsInline muted />
      {!callInProgress && <button className="start-call-button" onClick={startCall}>Iniciar Chamada</button>}
      {offer && <button className="start-call-button" onClick={acceptOffer}>Aceitar Chamada</button>}

      <div className="barra-config">
        <img src='phone.png' />
        {
          videoActive 
          ?
          <img onClick={() => setVideoActive(!videoActive)} src='video-active.png' />
          :
          <img onClick={() => setVideoActive(!videoActive)} src='video-desactive.png' />
        }

        {
          micActive
          ?
          <img onClick={() => setMicActive(!micActive)} src='mic.png' />
          :
          <img onClick={() => setMicActive(!micActive)} src='mute.png' />
        }
        {
          chatActive
          ?
          <img onClick={() => setChatActive(!chatActive)} src='comment (1).png' />
          :
          <img onClick={() => setChatActive(!chatActive)} src='comment.png' />
        }
      </div>
      {
        chatActive
        &&
      <div className='chat-live'>
        <div className='barra-cima-v'>
          <img src='image.svg' />
          <p>Jana Maria da Silva</p>
        </div>
        <div className='conversa'>
          
        </div>
        <div className='barra-baixo-v'>
          <input placeholder='Digite uma mensagem' />
          <button>Enviar</button>
        </div>
      </div>
      }
    </div>
  );
};

export default VideoConference;