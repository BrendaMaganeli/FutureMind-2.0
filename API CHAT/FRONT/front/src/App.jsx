import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Chat em Tempo Real</h1>
      <div className="w-full max-w-md bg-white p-4 shadow-lg rounded-lg overflow-auto h-96 mb-4">
        {chat.map((msg, index) => (
          <p key={index} className="bg-blue-200 p-2 rounded my-1">{msg}</p>
        ))}
      </div>
      <div className="flex w-full max-w-md">
        <input
          className="flex-1 p-2 border rounded-l"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Digite sua mensagem..."
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};