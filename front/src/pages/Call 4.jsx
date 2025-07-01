import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./CSS/Call.css";

const socket = io('http://localhost:5000');

function VideoConferencia4() {

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const localStreamRef = useRef(null);

    const [videoActive, setVideoActive] = useState(true);
    const [micActive, setMicActive] = useState(true);
    const [callInProgress, setCallInProgress] = useState(false);
    const [acceptedCall, setAcceptedCall] = useState(false);
    const [incomingOffer, setIncomingOffer] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [espelhar, setEspelhar] = useState('mirror');
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.muted = true; // Vídeo local sempre mudo
                }
            })
            .catch((error) => console.error("Erro ao acessar mídia:", error));

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            endCall();
        };
    }, []);

    useEffect(() => {
      if (acceptedCall && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = new MediaStream(); // opcional
          setCallInProgress(true);
          setAcceptedCall(false);
      } else {

        console.log('erro');
      }
    }, [acceptedCall]);


    // Configuração do socket
    useEffect(() => {

        socket.on("users", (users) => {
            setOnlineUsers(users.filter(u => u !== socket.id));
        });

        socket.on("offer", (data) => {
            console.log("Oferta recebida de:", data.from);
            setIncomingOffer(data);
            setTargetUser(data.from);
        });

        socket.on("answer", async (data) => {
        console.log("Resposta recebida:", data);
        const remoteDesc = new RTCSessionDescription(data.answer);
        await peerConnection.current.setRemoteDescription(remoteDesc);
});

        socket.on("ice-candidate", async (data) => {
            if (peerConnection.current && data.candidate) {
                try {
                    await peerConnection.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                } catch (error) {
                    console.error("Erro ao adicionar ICE candidate:", error);
                }
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

    useEffect(() => {

      if (remoteVideoRef.current && remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
      } else {
        console.warn("remoteVideoRef ou remoteStream estão faltando");
      }
    }, [remoteStream]);


    const setupPeerConnection = () => {
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    { urls: "stun:stun2.l.google.com:19302" }
                ]
            });

            // Adiciona as tracks locais
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current);
            });

            pc.onicecandidate = (event) => {
                if (event.candidate && targetUser) {
                    socket.emit("ice-candidate", {
                        to: targetUser,
                        candidate: event.candidate
                    });
                }
            };

        pc.ontrack = (event) => {
        console.log("Track recebida:", event.streams[0]);
        setRemoteStream(event.streams[0]);
    };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'disconnected') {
                endCall();
            }
        };

        return pc;
    };

    const startCall = async () => {
        if (!targetUser) {
            console.log("Selecione um usuário para chamar");
            return;
        }

        try {
            peerConnection.current = setupPeerConnection();
            
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit("offer", {
                to: targetUser,
                offer: offer,
                from: socket.id
            });

            setCallInProgress(true);
        } catch (error) {
            console.error("Erro ao iniciar chamada:", error);
            endCall();
        }
    };

const acceptCall = async () => {
    if (!incomingOffer) return;

    try {
        peerConnection.current = setupPeerConnection();

        await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(incomingOffer.offer)
        );

        const answer = await peerConnection.current.createAnswer();
        console.log("Answer criado:", answer);
        await peerConnection.current.setLocalDescription(answer);

        console.log("Emitindo answer:", {
    to: incomingOffer.from,
    answer: answer,
    from: socket.id
});
        socket.emit("answer", {
            to: incomingOffer.from,
            answer: answer,
            from: socket.id
        });

        setAcceptedCall(true);
        setIncomingOffer(null);
    } catch (error) {
        console.error("Erro ao aceitar chamada:", error);
        endCall();
    }
};



    const endCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
            remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject = null;
        }
        
        setCallInProgress(false);
        setIncomingOffer(null);
        setTargetUser(null);
        setRemoteStream(null);
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

    return (
        <div className="videoconferencia-container">
            <video 
                ref={localVideoRef} 
                className={`me-video ${espelhar}`} 
                autoPlay 
                playsInline 
                muted
            />

            <video 
              ref={remoteVideoRef} 
              className={`other-video ${espelhar}`} 
              autoPlay 
              playsInline 
              style={{ display: callInProgress ? "flex" : "none" }}
             />

            {!callInProgress && (
              <img
                className="resposta.carre"
                src="/public/carre-resposta.svg"
                alt="Aguardando chamada"
              />
            )}

            <div className="barra-config">
                {callInProgress ? (
                    <img src="/public/phone.png" alt="Telefone" onClick={endCall} />
                ) : null}
                
                <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
                    <img
                        onClick={toggleVideo}
                        src={videoActive ? "/public/video-active.png" : "/public/video-desactive.png"}
                        alt={videoActive ? "Vídeo Ativo" : "Vídeo Desativado"}
                    />
                    <p style={{ color: videoActive ? "white" : "#013a63" }}>Vídeo</p>
                </div>
                
                <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
                    <img
                        onClick={toggleAudio}
                        src={micActive ? "/public/mic.png" : "/public/mute.png"}
                        alt={micActive ? "Microfone Ativo" : "Microfone Mutado"}
                    />
                    <p style={{ color: micActive ? "white" : "#013a63" }}>Áudio</p>
                </div>
                
                <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
                    <img
                        onClick={() => setEspelhar(espelhar === 'mirror' ? '' : 'mirror')}
                        src={espelhar === 'mirror' ? "/public/espelho 1.svg" : "/public/espelho (1) 1.svg"}
                        alt={espelhar === 'mirror' ? "Espelhar" : "Não Espelhar"}
                    />
                    <p style={{ color: espelhar === 'mirror' ? "white" : "#013a63" }}>Espelhar</p>
                </div>
            </div>

            {!callInProgress && !incomingOffer && (
                <button className="start-call-button" onClick={startCall}>
                    Iniciar Chamada
                </button>
            )}

            {incomingOffer && !callInProgress && (
                <div className="incoming-call">
                    <button className="end-call-button" onClick={endCall}>
                        Recusar
                    </button>
                    <button className="end-call-button" onClick={acceptCall}>
                        Aceitar Chamada
                    </button>
                </div>
            )}

            <div className="users-online-container">
                <h4>Usuários Online</h4>
                {onlineUsers.map((user) => (
                    <div key={user} className="user-item">
                        <span>ID: {user}</span>
                        <button
                            onClick={() => setTargetUser(user)}
                            disabled={callInProgress || incomingOffer}
                        >
                            {targetUser === user ? "Selecionado" : "Selecionar"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VideoConferencia4;