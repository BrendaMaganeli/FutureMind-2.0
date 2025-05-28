import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './CSS/Call.css';

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
  const [userId, setUserId] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const socket = io("http://localhost:5000");
  const usersUpdateRef = useRef(null);

useEffect(() => {
  const handleConnect = () => {
    setUserId(socket.id);
    console.log("Conectado com ID:", socket.id);
  };

  const handleUsersUpdate = (users) => {
    const otherUsers = users.filter(u => u !== socket.id);
    setOnlineUsers(prev => {

      if (JSON.stringify(prev) !== JSON.stringify(otherUsers)) {
        return otherUsers;
      }
      return prev;
    });
  };

  socket.on("connect", handleConnect);
  socket.on("users", handleUsersUpdate);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("users", handleUsersUpdate);
  };
}, [socket.id]);

  const initializePeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
  }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && targetUser) {
        console.log("Enviando ICE candidate para", targetUser);
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: targetUser,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("Recebendo stream remoto");
      if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnection.current = pc;
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Stream local obtido");
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
  }, []);

  useEffect(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = videoActive;

      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = micActive;
    }
  }, [videoActive, micActive]);

  useEffect(() => {
    const handleOffer = async ({ offer, from }) => {
      console.log(`Oferta recebida de ${from}`);
      setTargetUser(from);
      setOffer({ offer, from });
    };

    const handleAnswer = async (answer) => {
      if (!peerConnection.current) return;
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Resposta recebida e aplicada");
      } catch (error) {
        console.error("Erro ao definir resposta remota:", error);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      if (candidate && peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("ICE candidate adicionado");
        } catch (err) {
          console.error("Erro ao adicionar ICE candidate:", err);
        }
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, []);

  const startCall = async () => {
    if (!targetUser) {
      alert("Selecione um usuário da lista abaixo antes de chamar");
      return;
    }

    try {
      console.log("Iniciando chamada para", targetUser);
      initializePeerConnection();
      
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", { 
        offer, 
        to: targetUser, 
        from: userId 
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
      console.log("Aceitando oferta de", offer.from);
      initializePeerConnection();

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer.offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", { 
        answer, 
        to: offer.from 
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
    setCallInProgress(false);
    setTargetUser(null);
    setOffer(null);
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

  return (
    <div className="videoconferencia-container">
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
        <img className="resposta.carre" src="/public/carre-resposta.svg"/>
      }

      {!callInProgress && !offer && (
        <button className="start-call-button" onClick={startCall}>
          Iniciar Chamada
        </button>
      )}
      
      {offer && (
        <div className="incoming-call">
          <button className="start-call-button" onClick={acceptOffer}>
            Aceitar Chamada
          </button>
          <button className="end-call-button" onClick={endCall}>
            Recusar
          </button>
        </div>
      )}
      
      {callInProgress && (
        <button className="end-call-button" onClick={endCall}>
          Encerrar Chamada
        </button>
      )}

      <div className="barra-config">
        <img src='/public/phone.png' alt="Telefone" onClick={endCall}/>
        {videoActive ? (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}>
            <img onClick={() => setVideoActive(!videoActive)} src='/public/video-active.png' alt="Vídeo Ativo" />
            <p style={{color: 'white'}}>Vídeo</p>
          </div>
        ) : (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}>
            <img onClick={() => setVideoActive(!videoActive)} src='/public/video-desactive.png' alt="Vídeo Desativado" />
            <p style={{color: '#013a63'}}>Vídeo</p>
          </div>
        )}
        {micActive ? (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
            <img onClick={() => setMicActive(!micActive)} src='/public/mic.png' alt="Microfone Ativo" />
            <p style={{color: 'white'}}>Áudio</p>
          </div>
        ) : (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
            <img onClick={() => setMicActive(!micActive)} src='/public/mute.png' alt="Microfone Mutado" />
            <p style={{color: '#013a63'}}>Áudio</p> 
          </div> 
        )}
        {chatActive ? (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
            <img onClick={() => setChatActive(!chatActive)} src='/public/comment (1).png' alt="Chat Aberto" />
            <p style={{color: '#013a63'}}>Chat</p> 
          </div>
        ) : (
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
            <img onClick={() => setChatActive(!chatActive)} src='/public/comment.png' alt="Chat Fechado" />
            <p style={{color: 'white'}}>Chat</p> 
          </div>
        )}
        {espelhar==='mirror' ?
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
            <img onClick={() => setEspelhar('')} src='/public/espelho 1.svg' />
            <p style={{color: 'white'}}>Espelhar</p> 
          </div>
          :
          <div className='ppp' style={{display: 'flex', flexDirection: 'column'}}> 
            <img onClick={() => setEspelhar('mirror')} src='/public/espelho (1) 1.svg' />
            <p style={{color: '#013a63'}}>Espelhar</p> 
          </div>
        }
      </div>

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
                {theme === 'light' ? <img src='/public/Arvore Azul.svg' alt="" /> : <img src='/public/Arvore Branca.svg' alt="" />}
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
            <div className="btn-send">
              <button 
                onClick={() => {
                  if (inptvalue.trim() !== '') {
                    setMessages([...messages, { text: inptvalue, sender: 'me', foto: 'img.meu-foto.png' }]);
                    setInptvalue('');
                  }
                }}
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}

      {visibleSettings && (
        <div ref={settingsRef} className="settings-modal">
          <h3>Configurações</h3>
          <div onClick={toggleTheme} style={{cursor:'pointer'}}>
            Tema: {theme} (Clique para alternar)
          </div>
        </div>
      )}

      <div className="users-online-container">
        <h4>Usuários Online</h4>
        {onlineUsers.map((user) => (
          <div key={user} className="user-item">
            <span>ID: {user}</span>
            <button 
              onClick={() => {
                setTargetUser(user);
                console.log("Usuário alvo definido:", user);
              }}
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