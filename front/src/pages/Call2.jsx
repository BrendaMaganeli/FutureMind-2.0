import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./CSS/Call.css";

const socket = io('https://futuremind-20-production.up.railway.app', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

function VideoConferencia2 () {

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const localStreamRef = useRef(null);

    const [videoActive, setVideoActive] = useState(true);
    const [micActive, setMicActive] = useState(true);
    const [callInProgress, setCallInProgress] = useState(false);
    const [incomingOffer, setIncomingOffer] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [espelhar, setEspelhar] = useState('mirror');
    const [isCaller, setIsCaller] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 1100, y: 20 });
    const dragOffset = useRef({ x: 0, y: 0 });
    const [callTime, setCallTime] = useState(0);  // segundos transcorridos
    const timerRef = useRef(null);

    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
                setError("Não foi possível acessar câmera/microfone. Verifique as permissões.");
            }
        };

        initializeMedia();

        // Socket.IO event handlers with error handling
        const handleConnect = () => {
            setConnectionStatus("Connected");
            setError(null);
            console.log("Conectado ao servidor Socket.IO");
        };

        const handleConnectError = (err) => {
            setConnectionStatus("Connection Failed");
            setError(`Falha na conexão: ${err.message}`);
            console.error("Connection error:", err);
        };

        const handleDisconnect = (reason) => {
            setConnectionStatus("Disconnected");
            if (reason === "io server disconnect") {
                setError("Servidor desconectado. Reconectando...");
            }
            console.log("Disconnected:", reason);
        };

        const handleReconnectAttempt = (attempt) => {
            setConnectionStatus(`Tentando reconectar (${attempt}/5)`);
            console.log(`Reconnection attempt ${attempt}`);
        };

        const handleReconnectFailed = () => {
            setConnectionStatus("Failed to reconnect");
            setError("Não foi possível reconectar ao servidor. Recarregue a página.");
            console.error("Reconnection failed");
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);
        socket.on("reconnect_attempt", handleReconnectAttempt);
        socket.on("reconnect_failed", handleReconnectFailed);

        // WebRTC signaling handlers
        socket.on("users", (users) => {
            setOnlineUsers(users.filter(u => u !== socket.id));
        });

        socket.on("offer", (data) => {
            console.log("Offer received from:", data.from);
            setIncomingOffer(data);
            setTargetUser(data.from);
            setIsCaller(false);
        });

        socket.on("answer", async (data) => {
            console.log("Answer received:", data);
            if (peerConnection.current) {
                try {
                    const remoteDesc = new RTCSessionDescription(data.answer);
                    await peerConnection.current.setRemoteDescription(remoteDesc);
                    setCallInProgress(true);
                    setError(null);
                } catch (error) {
                    console.error("Error setting remote description:", error);
                    setError("Falha ao estabelecer conexão com o parceiro.");
                }
            }
        });

        socket.on("ice-candidate", async (data) => {
            if (peerConnection.current && data.candidate) {
                try {
                    await peerConnection.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            }
        });

        return () => {
            // Cleanup socket listeners
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);
            socket.off("reconnect_attempt", handleReconnectAttempt);
            socket.off("reconnect_failed", handleReconnectFailed);
            socket.off("users");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");

            // Cleanup media
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            endCall();
        };
    }, []);

    useEffect(() => {
    if (callInProgress) {
        // inicia / retoma o cronômetro
        timerRef.current = setInterval(() => {
            setCallTime(prev => prev + 1);
        }, 1000);
    } else {
        // pausa e zera quando a chamada termina
        clearInterval(timerRef.current);
        timerRef.current = null;
        setCallTime(0);
    }

    // limpeza se o componente desmontar
    return () => clearInterval(timerRef.current);
    }, [callInProgress]);

    const formatTime = (totalSeconds) => {
        const hrs  = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };


    const setupPeerConnection = () => {
        try {
            const pc = new RTCPeerConnection({
                iceServers: [
                    {
                    urls: 'turn:seu-ip-ou-dominio:3478',
                    username: 'usuario',
                    credential: 'senha123',
                },
                    { urls: "stun:stun.l.google.com:19302" }
                ]
            });

            // Add local stream tracks
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
                if (remoteVideoRef.current && event.streams && event.streams[0]) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            pc.oniceconnectionstatechange = () => {
                if (pc.iceConnectionState === 'disconnected' || 
                    pc.iceConnectionState === 'failed') {
                    setError("Conexão com o parceiro perdida.");
                    endCall();
                }
            };

            pc.onnegotiationneeded = async () => {
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    if (targetUser) {
                        socket.emit("offer", {
                            to: targetUser,
                            offer: offer,
                            from: socket.id
                        });
                    }
                } catch (err) {
                    console.error("Negotiation error:", err);
                    setError("Erro na negociação de conexão");
                }
            };

            return pc;
        } catch (error) {
            console.error("Error setting up peer connection:", error);
            setError("Falha ao configurar conexão P2P");
            return null;
        }
    };

    const startCall = async () => {
        if (!targetUser) {
            setError("Selecione um usuário para chamar");
            return;
        }

        try {
            setIsCaller(true);
            peerConnection.current = setupPeerConnection();
            
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit("offer", {
                to: targetUser,
                offer: offer,
                from: socket.id
            });

            setCallInProgress(true);
            setError(null);
        } catch (error) {
            console.error("Error starting call:", error);
            setError("Falha ao iniciar chamada");
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
            await peerConnection.current.setLocalDescription(answer);

            socket.emit("answer", {
                to: incomingOffer.from,
                answer: answer,
                from: socket.id
            });

            setCallInProgress(true);
            setIncomingOffer(null);
            setError(null);
        } catch (error) {
            console.error("Error accepting call:", error);
            setError("Falha ao aceitar chamada");
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
        setIsCaller(false);

        clearInterval(timerRef.current);
        timerRef.current = null;
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
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

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

    return (
        <div className="videoconferencia-container">
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="connection-status">
                Status: {connectionStatus}
            </div>

            <video 
                ref={localVideoRef} 
                className={`me-video ${espelhar}`} 
                autoPlay 
                playsInline 
                onMouseDown={handleMouseDown}
                style={{
                    left: position.x,
                    top: position.y,
                    cursor: dragging ? "grabbing" : "grab"
                }}
                muted
            />

            <video 
                ref={remoteVideoRef} 
                className={`other-video ${espelhar}`} 
                autoPlay 
                playsInline 
                style={{ display: callInProgress ? "block" : "none" }}
            />

            {!callInProgress && (
                <img
                    className="resposta.carre"
                    src="/public/carregando.svg"
                    alt="Waiting for call"
                />
            )}

            {callInProgress && (
                <div className="call-timer">
                    {formatTime(callTime)}
                </div>
            )}

            <div className="barra-config">
                {callInProgress ? (
                    <img src="/public/phone.png" alt="End call" onClick={endCall} />
                ) : null}
                
                <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
                    <img
                        onClick={toggleVideo}
                        src={videoActive ? "/public/video-active.png" : "/public/video-desactive.png"}
                        alt={videoActive ? "Video On" : "Video Off"}
                    />
                    <p style={{ color: videoActive ? "white" : "#013a63" }}>Video</p>
                </div>
                
                <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
                    <img
                        onClick={toggleAudio}
                        src={micActive ? "/public/mic.png" : "/public/mute.png"}
                        alt={micActive ? "Mic On" : "Mic Off"}
                    />
                    <p style={{ color: micActive ? "white" : "#013a63" }}>Audio</p>
                </div>
                
                <div className="ppp" style={{ display: "flex", flexDirection: "column" }}>
                    <img
                        onClick={() => setEspelhar(espelhar === 'mirror' ? '' : 'mirror')}
                        src={espelhar === 'mirror' ? "/public/espelho 1.svg" : "/public/espelho (1) 1.svg"}
                        alt={espelhar === 'mirror' ? "Mirror On" : "Mirror Off"}
                    />
                    <p style={{ color: espelhar === 'mirror' ? "white" : "#013a63" }}>Mirror</p>
                </div>
            </div>

            {!callInProgress && !incomingOffer && (
                <button className="start-call-button" onClick={startCall}>
                    Start Call
                </button>
            )}

            {incomingOffer && !callInProgress && (
                <div className="incoming-call">
                    <button className="end-call-button" onClick={endCall}>
                        Decline
                    </button>
                    <button className="accept-call-button" onClick={acceptCall}>
                        Accept Call
                    </button>
                </div>
            )}

            <div className="users-online-container">
                <h4>Online Users ({onlineUsers.length})</h4>
                {onlineUsers.map((user) => (
                    <div key={user} className="user-item">
                        <span>ID: {user}</span>
                        <button
                            onClick={() => setTargetUser(user)}
                            disabled={callInProgress || incomingOffer}
                        >
                            {targetUser === user ? "Selected" : "Select"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VideoConferencia2;