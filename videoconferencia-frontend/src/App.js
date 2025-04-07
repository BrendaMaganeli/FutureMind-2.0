import React, { useEffect, useRef, useState } from "react";
import close from '../assets/Group 239210.svg';
import cam from '../assets/cam-recorder (1) 1.svg';
import block from '../assets/blocked 1.svg';
import handClick from '../assets/image 17.svg';
import microfone from '../assets/image 15.svg';
import figurinhaIcon from '../assets/image 16.svg';
import arvoreAzul from '../assets/Arvore Azul.svg';
import arvoreBranca from '../assets/Arvore Branca.svg';
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

  const [chatSelected, setChatSelected] = useState();
  const settingsRef = useRef(null);
  const [theme, setTheme] = useState('light');
  const tema = theme==='light' ? 'escuro' : 'claro';
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [inptvalue, setInptvalue] = useState('');
  const [name, setName] = useState('');

  const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
      const nameAux = prompt('Qual seu nome?');
      setName(nameAux);

      socket.on("receiveMessage", (data) => {
          let newMessage = JSON.parse(data);
          newMessage.sender = newMessage.name === nameAux ? 'me' : 'other';
          setMessages(prevMessages => [...prevMessages, newMessage]);
      });

      return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages]);

  useEffect(() => {
      function handleClickOutside(event) {
          if (settingsRef.current && !settingsRef.current.contains(event.target)) {
              setVisibleSettings(false);
          }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sendMessage = (e) => {
      e.preventDefault();
      if (inptvalue.trim() === '') return;

      const newMessage = { sender: 'me', text: inptvalue, foto: mulher, name: name };
      setInptvalue('');
      socket.emit("sendMessage", JSON.stringify(newMessage));
  };

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
          <div className="barra-top">
              <div className="img-foto">
                  <img src={chatSelected.foto} alt="" />
              </div>
              <div className="nome-user-chat">
                  <h5>{chatSelected.nome}</h5>
              </div>
              <div className="icons-chat">
                  <div className="icons-chat-p">
                      <img src={cam} className='icon-chat-p-1' alt="" />  
                      <img src={block} className='icon-chat-p-2' alt="" />
                  </div>
                  <img onClick={() => setChatSelected('')} src={close} className='icon-chat-p-3' alt="" />
              </div>
          </div>
          <div style={{height: '83%', overflowY: 'auto'}}>
              <div className="messages-div">
                  <div className="acess-profile-div">
                      <div className="user-name">@jana.silvaa</div>
                      <div className="btn-acess">
                          <b>Acessar perfil</b>
                      </div>
                  </div>
                  <div className="arvore-chat">
                      {theme === 'light' ? <img src={arvoreAzul} alt="" /> : <img src={arvoreBranca} alt="" />}
                  </div>
                  {messages.map((msg, index) => (
                      <div key={index} className={msg.sender === 'me' ? 'message-right' : 'message-left'}>
                          {msg.sender !== 'me' &&
                              <div className="image-message-right">
                                  <img src={msg.foto} alt="" />
                              </div>
                          }
                          <div className={msg.sender === 'me' ? 'text-message-right' : 'text-message-left'}>
                              {msg.text}
                          </div>
                          {msg.sender === 'me' &&
                              <div className="image-message-left">
                                  <img src={msg.foto} alt="" />
                              </div>
                          }
                      </div>
                  ))}
                  <div ref={messagesEndRef}></div>
              </div>
          </div>
          <form onSubmit={sendMessage} className="barra-bottom">
              <div className="inpt-chat">
                  <input type="text" placeholder='Enter a message...' value={inptvalue} onChange={(e) => setInptvalue(e.target.value)} />
              </div>
              <div className="icons-chat-inpt">
                  <div className="icons-inpt-a">
                      <img src={figurinhaIcon} alt="" />
                      <img src={microfone} alt="" />
                  </div>
                  <button type='submit'>
                      <img src={handClick} className='hand-click' alt="" />
                  </button>
              </div>
          </form>
      </div>
      }
    </div>
  );
};

export default VideoConference;