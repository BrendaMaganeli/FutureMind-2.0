import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:5000");

const VideoConference = () => {
//1
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
      localStreamRef.current = stream; // Salva o stream aqui
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
    if (videoTrack) {
      videoTrack.enabled = videoActive;
    }
  }
}, [videoActive]);



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

 

  const [chatSelected, setChatSelected] = useState({foto: 'img.conversa.chat.png', nome: 'Jana Maria'});
  const settingsRef = useRef(null);
  const [theme, setTheme] = useState('light');
  const tema = theme === 'light' ? 'escuro' : 'claro';
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [inptvalue, setInptvalue] = useState('');
  const [name, setName] = useState('');
  const [espelhar, setEspelhar] = useState('mirror');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // useEffect(() => {

  //   socket.on("receiveMessage", (data) => {
  //     let newMessage = JSON.parse(data);
  //     newMessage.sender = newMessage.name === nameAux ? 'me' : 'other';
  //     setMessages(prevMessages => [...prevMessages, newMessage]);
  //   });

  //   return () => socket.off("receiveMessage");
  // }, []);

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

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   if (inptvalue.trim() === '') return;

  //   const newMessage = { sender: 'me', text: inptvalue, foto: 'icone_usuario.svg', name: name };
  //   setInptvalue('');
  //   socket.emit("sendMessage", JSON.stringify(newMessage));
  // };

  return (
    <div className="videoconferencia-container">
      {/* Vídeos */}
      <video 
        onClick={() => setClicked(!clicked)} 
        ref={!clicked ? localVideoRef : remoteVideoRef} 
        className={!clicked ? `me-video ${espelhar}` : `other-video ${espelhar}`} 
        autoPlay 
        playsInline 
        muted 
      />
      {
        clicked ?
        <video 
        ref={!clicked ? remoteVideoRef : localVideoRef} 
        className={!clicked ? `other-video ${espelhar}` : `me-video ${espelhar}`} 
        autoPlay 
        playsInline 
        muted 
        /> 
        : 
        <img className="resposta.carre" src="carre.resposta2 (14).svg"/>
      }

      {/* Botões de chamada */}
      {!callInProgress && <button className="start-call-button" onClick={startCall}>Iniciar Chamada</button>}
      {offer && <button className="start-call-button" onClick={acceptOffer}>Aceitar Chamada</button>}

      {/* Barra de Configurações */}
      <div className="barra-config">
        <img src='phone.png' alt="Telefone"/>
        {videoActive ? (

          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}>
          <img onClick={() => setVideoActive(!videoActive)} src='video-active.png' alt="Vídeo Ativo" />
          <p style={{color: 'white'}}>Vídeo</p>
          </div>
        ) : (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}>
          <img onClick={() => setVideoActive(!videoActive)} src='video-desactive.png' alt="Vídeo Desativado" />
          <p style={{color: '#013a63'}}>Vídeo</p>
          </div>
        )}
        {micActive ? (

          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
          <img onClick={() => setMicActive(!micActive)} src='mic.png' alt="Microfone Ativo" />
          <p style={{color: 'white'}}>Áudio</p>
          </div>
        ) : (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
          <img onClick={() => setMicActive(!micActive)} src='mute.png' alt="Microfone Mutado" />
          <p style={{color: '#013a63'}}>Áudio</p> </div> 

        )}
        {chatActive ? (

          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
          <img onClick={() => setChatActive(!chatActive)} src='comment (1).png' alt="Chat Aberto" />
          <p style={{color: '#013a63'}}>Chat</p> </div>

        ) : (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
          <img onClick={() => setChatActive(!chatActive)} src='comment.png' alt="Chat Fechado" />
          <p style={{color: 'white'}}>Chat</p> </div>

        )}
        {espelhar==='mirror' ?

        <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
        <img onClick={() => setEspelhar('')} src='espelho 1.svg' />
        <p style={{color: 'white'}}>Espelhar</p> </div>

        :
        <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
        <img onClick={() => setEspelhar('mirror')} src='espelho (1) 1.svg' />
        <p style={{color: '#013a63'}}>Espelhar</p> </div>

        }
      </div>

      {/* Chat */}
      {chatActive && (
        <div className='chat-live'>
          <div className="barra-top">
            <div className="img-foto">
              <img src={chatSelected?.foto} alt="" />
            </div>
            <div className="nome-user-chat">
              <h5>{chatSelected.nome}</h5>
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
                {theme === 'light' ? <img src='Arvore Azul.svg' alt="" /> : <img src='Arvore Branca.svg' alt="" />}
              </div>
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === 'me' ? 'message-right' : 'message-left'}>
                  {msg.sender !== 'me' && (
                    <div className="image-message-right">
                      <img src={msg.foto} alt="" />
                    </div>
                  )}
                  <div className={msg.sender === 'me' ? 'text-message-right' : 'text-message-left'}>
                    {msg.text}
                  </div>
                  {msg.sender === 'me' && (
                    <div className="image-message-left">
                      <img src={msg.foto} alt="" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="barra-bottom">
            <div className="inpt-chat">
              <input 
                type="text" 
                placeholder='Enter a message...' 
                value={inptvalue} 
                onChange={(e) => setInptvalue(e.target.value)} 
              />
            </div>
            <div className="icons-chat-inpt">
              <button type='submit'>
                <img src='message (1).png' className='hand-click' alt="" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
