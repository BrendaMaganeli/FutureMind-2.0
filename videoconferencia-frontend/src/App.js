import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:5000");

const VideoConference = () => {
  const localVideoRef = useRef(null);
  const [remoteVideos, setRemoteVideos] = useState({});
  const peerConnections = useRef({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        socket.on("users-list", (userList) => {
          setUsers(userList.filter((id) => id !== socket.id));
        });

        socket.on("offer", async ({ sdp, caller }) => {
          const peerConnection = createPeerConnection(caller);
          peerConnections.current[caller] = peerConnection;
          await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("answer", { sdp: answer, target: caller });
        });

        socket.on("answer", async ({ sdp, responder }) => {
          if (peerConnections.current[responder]) {
            await peerConnections.current[responder].setRemoteDescription(new RTCSessionDescription(sdp));
          }
        });

        socket.on("ice-candidate", ({ candidate, sender }) => {
          if (peerConnections.current[sender]) {
            peerConnections.current[sender].addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

      })
      .catch((error) => console.error("Erro ao acessar mídia:", error));
  }, []);

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection();
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, target: peerId });
      }
    };

    pc.ontrack = (event) => {
      setRemoteVideos((prev) => ({
        ...prev,
        [peerId]: event.streams[0],
      }));
    };

    localVideoRef.current.srcObject.getTracks().forEach((track) => {
      pc.addTrack(track, localVideoRef.current.srcObject);
    });

    return pc;
  };

  const callUser = async (userId) => {
    const peerConnection = createPeerConnection(userId);
    peerConnections.current[userId] = peerConnection;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("offer", { sdp: offer, target: userId });
  };

  return (
    <div className="videoconferencia-container">
      <video className='me-video' ref={localVideoRef} autoPlay playsInline></video>

      <div className="remote-videos">
        {Object.entries(remoteVideos).map(([id, stream]) => (
          <video key={id} ref={(ref) => ref && (ref.srcObject = stream)} autoPlay playsInline className="other-video" />
        ))}
      </div>

      <div className="barra-config">
        {users.map((userId) => (
          <button key={userId} onClick={() => callUser(userId)}>
            Chamar {userId}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoConference;
