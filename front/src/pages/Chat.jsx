import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { GlobalContext } from "../Context/GlobalContext";
import "./CSS/Chat.css";

import voltar from "../assets/seta-principal.svg";
import config from "../assets/settings.svg";
import help from "../assets/help 1.svg";
import lupa from "../assets/search 1.svg";
import close from "../assets/close-2.svg";
import cam from "../assets/cam-recorder (1) 1.svg";
import block from "../assets/blocked 1.svg";
import arvoreAzul from "../assets/Arvore Azul.svg";
import arvoreBranca from "../assets/Arvore Branca.svg";

function Chat({ idChatSelected, setIdChatSelected, profissionalSelected, setIsInChat }) {
  const { user } = useContext(GlobalContext);
  const userType = user.id_paciente ? "Paciente" : "Profissional";
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [chatSelected, setChatSelected] = useState(idChatSelected ? profissionalSelected : null);
  const [messages, setMessages] = useState([]);
  const [ocultos, setOcultos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [result, setResult] = useState([]);
  const [busca, setBusca] = useState("");
  const [inptvalue, setInptvalue] = useState("");
  const [mostrarLogo, setMostrarLogo] = useState(true);
  const [isChatSelected, setIsChatSelected] = useState("chat-not-selected");
  const [useResult, setUseResult] = useState(false);
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [hoverElement, setHoverElement] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [hoverMessage, setHoverMessage] = useState(null);
  const [openModalMessage, setOpenModalMessage] = useState(null);

  const tema = theme === "light" ? "escuro" : "claro";
  const socket = useRef();
  const settingsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageRef = useRef(null);

  const filters = [
    { text: "Ocultos", active: false },
    { text: "A-Z", active: false },
    { text: "Antigas", active: false },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!user) return console.log("Usuário não encontrado");

        const data = {
          fk_id: user.id_profissional || user.id_paciente,
          userType: user.id_profissional ? "Profissional" : "Paciente",
        };

        const response = await fetch("https://futuremind-2-0.onrender.com/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) return console.log("Erro ao encontrar chats");

        const dataResponse = await response.json();
        const uniqueChats = dataResponse.filter((chat, index, self) =>
          index === self.findIndex(c => 
            c.id_profissional === chat.id_profissional && 
            c.id_paciente === chat.id_paciente
          )
        );

        setChats(uniqueChats);
      } catch (error) {
        console.error({ Erro: error });
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    if (!chatSelected) return;

    const fetchMessages = async (id) => {
      try {
        let dado = {};

        if (userType === "Profissional") {
          dado = { id_paciente: id, id_profissional: user.id_profissional };
        } else if (userType === "Paciente") {
          dado = { id_profissional: id, id_paciente: user.id_paciente };
        }

        if (!dado) return console.log("erro N");

        const response = await fetch("https://futuremind-2-0.onrender.com/chats/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dado),
        });

        if (!response.ok) {
          setMessages([]);
          return console.log("erro");
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erro interno do servidor", error);
      }
    };

    const idAux = userType === "Profissional" 
      ? chatSelected.id_paciente 
      : chatSelected.id_profissional;
    
    fetchMessages(idAux);
  }, [chatSelected, user, userType]);

  useEffect(() => {
    if (userType === 'Paciente') {
      const buscaProfissionais = async () => {
        try {
          const response = await fetch("https://futuremind-2-0-mw60.onrender.com");
          if (response.ok) {
            const data = await response.json();  
            setProfissionais(data);
          }
        } catch (err) {
          console.log("Erro ao buscar profissionais:", err);
        }
      };
      buscaProfissionais();
    } else {
      const buscaPacientes = async () => {
        try {
          const response = await fetch("https://futuremind-2-0-mw60.onrender.com/pacientes");
          if (response.ok) {
            const data = await response.json();  
            setPacientes(data);
          }
        } catch (err) {
          console.log("Erro ao buscar pacientes:", err);
        }
      };
      buscaPacientes();
    }
  }, [userType]);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("https://futuremind-2-0-2.onrender.com");

      socket.current.on("connect", () => console.log("Conectado ao Socket.IO!"));
      socket.current.on("connect_error", (err) => console.error("Erro de conexão:", err));
    }
  }, []);

  useEffect(() => {
    if (!chatSelected || !socket.current) return;

    const roomId = userType === "Profissional"
      ? `chat_${chatSelected.id_paciente}_${user.id_profissional}`
      : `chat_${user.id_paciente}_${chatSelected.id_profissional}`;

    socket.current.emit("joinRoom", roomId);

    const handleNewMessage = (savedMessage) => {
      console.log("Nova mensagem recebida:", savedMessage);
      setMessages(prev => [...prev, savedMessage]);
    };

    socket.current.on("receiveMessage", handleNewMessage);

    return () => {
      socket.current.off("receiveMessage", handleNewMessage);
      socket.current.emit("leaveRoom", roomId);
    };
  }, [chatSelected, user, userType]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setVisibleSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setOpenModalMessage(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const toggleFontSize = () => {
    setFontSize(prevSize => {
      if (prevSize === "14px") return "16px";
      if (prevSize === "16px") return "18px";
      return "14px";
    });
  };

  const click = (index) => {
    const filtersAux = [...filters];
    const [clickedItem] = filtersAux.splice(index, 1);
    clickedItem.active = !clickedItem.active;
    filtersAux.unshift(clickedItem);
    setFilters(filtersAux);
    classifica(clickedItem);
  };

  const classifica = (item) => {
    if (!item.active) {
      if (item.text === "A-Z" || item.text === "Antigas" || item.text === "Ocultos") {
        setUseResult(false);
      }
      return;
    }

    if (item.text === "A-Z") {
      const sortedChats = [...chats].sort((a, b) => a.nome.localeCompare(b.nome));
      setResult(sortedChats);
      setUseResult(true);
    } else if (item.text === "Antigas") {
      const oldToNewChats = [...chats].reverse();
      setResult(oldToNewChats);
      setUseResult(true);
    } else if (item.text === "Ocultos") {
      const filtersAux = [...filters].map(filter => 
        filter.text !== item.text ? { ...filter, active: false } : filter
      );
      setFilters(filtersAux);
      setResult(ocultos);
      setUseResult(true);
    }
  };

  const buscaProfissional = (e) => {
    const termo = e.target.value;
    setBusca(termo);

    if (!termo) {
      setResult([]);
      setUseResult(false);
      return;
    }

    const filtrados = profissionais.filter(chat =>
      chat.nome.toLowerCase().includes(termo.toLowerCase())
    );
    setResult(filtrados || []);
    setUseResult(true);
  };

  const buscaPaciente = (e) => {
    const termo = e.target.value.toLowerCase();
    setBusca(termo);

    if (!termo) {
      setResult([]);
      setUseResult(false);
      return;
    }

    const filtrados = pacientes.filter(chat =>
      chat.nome?.toLowerCase().includes(termo)
    );
    setResult(filtrados || []);
    setUseResult(true);
  };

  const getDateTimeNow = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inptvalue.trim() || !chatSelected) return;

    const newMessage = {
      datahora: getDateTimeNow(),
      mensageiro: userType,
      mensagem: inptvalue,
      id_paciente: userType === "Profissional" ? chatSelected.id_paciente : user.id_paciente,
      id_profissional: userType === "Paciente" ? chatSelected.id_profissional : user.id_profissional,
      roomId: `chat_${userType === "Profissional" 
        ? `${chatSelected.id_paciente}_${user.id_profissional}` 
        : `${user.id_paciente}_${chatSelected.id_profissional}`}`,
    };

    setInptvalue("");
    fetchSendMessage(newMessage);
  };

  const handleVoltar = () => navigate(-1);

  const fetchSendMessage = async (message) => {
    try {
      const response = await fetch("https://futuremind-2-0.onrender.com/chats/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        console.log("Mensagem salva no banco de dados!");
        socket.current.emit("sendMessage", message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ocultaMensagem = (index) => {
    const messagesAux = [...messages];
    messagesAux.splice(index, 1);
    setMessages(messagesAux);
    setOpenModalMessage(null);
  };

  const excluiMensagem = async (mensagem, index) => {
    try {
      const data = {
        id_profissional: mensagem.id_profissional,
        id_paciente: mensagem.id_paciente,
        mensagem: mensagem.mensagem
      };

      const response = await fetch("https://futuremind-2-0.onrender.com/chats/mensagens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ocultaMensagem(index);
        console.log("Mensagem excluída com sucesso!");
      }
    } catch (error) {
      console.error(error, "Erro ao excluir mensagem");
    }
  };

  const ocultaChat = (index) => {
    const chatsAux = [...chats];
    const ocultedChat = chatsAux[index];
    chatsAux.splice(index, 1);
    setChats(chatsAux);
    setOcultos(prev => [...prev, ocultedChat]);
    setOpenModal(null);
  };

  const excluiChat = async (chat, index) => {
    try {
      let data = {};

      if (userType === "Profissional") {
        data = {
          id_profissional: user.id_profissional,
          id_paciente: chat.id_paciente,
        };
      } else if (userType === "Paciente") {
        data = {
          id_profissional: chat.id_profissional,
          id_paciente: user.id_paciente,
        };
      }

      if (!data) return console.log("Erro ao carregar dados");

      const response = await fetch("https://futuremind-2-0.onrender.com/chats", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ocultaChat(index);
        console.log("Conversa excluída com sucesso!");
      }
    } catch (error) {
      console.error(error, "Erro ao excluir chat");
    }

    window.location.reload();
  };

  const acessaPerfil = () => {
    if (typeof setIsInChat === 'function') setIsInChat(false);
    navigate(`/profissional/${chatSelected.id_profissional}`);
  };

  if (mostrarLogo) {
    return (
      <div className="logo-container">
        <div className="logo-elements">
          <h2 className="loading-animation">Carregando...</h2>    
        </div>
      </div>
    );
  }

  return (
    <div className={`container-chats ${theme} ${fontSize}`}>
      <div className="barra-lateral-chat">
        <div className="barra-cima">
          <img className="voltar-btn" onClick={handleVoltar} src={voltar} alt="" />
          <img 
            className="config-btn" 
            onClick={() => setVisibleSettings(!visibleSettings)} 
            src={config} 
            alt="" 
          />
          {visibleSettings && (
            <div className="settings" ref={settingsRef}>
              <div className="config" onClick={toggleFontSize}>Tamanho da fonte</div>
              <div className="config" onClick={toggleTheme}>Tema {tema}</div>
            </div>
          )}
        </div>
        <div className="barra-baixo">
          <img src={help} alt="" />
        </div>
      </div>

      <div className={`chats ${isChatSelected}`}>
        <div className="cabecalho-chats">
          <p>Chats</p>
        </div>
        <div className="pesquisa-chats">
          <div className="input-pesquisa">
            <div className="div-lupa-input">
              <img src={lupa} alt="Lupa pesquisa" />
              <input
                onChange={userType === 'Paciente' ? buscaProfissional : buscaPaciente}
                value={busca}
                type="text"
                placeholder="Busque por conversas..."
              />
            </div>
          </div>
          <div className="boxs-pesquisa">
            {filters.map((item, index) => (
              <div
                onClick={() => click(index)}
                className={item.active ? "box-pesquisa-checked" : "box-pesquisa"}
                key={index}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <div className="conversas">
          {(useResult ? result : chats).map((item, index) => (
            <div
              key={index}
              className="chat-barra"
              onClick={() => {
                setChatSelected(item);
                setIsChatSelected("chat-selected");
              }}
              onMouseEnter={() => setHoverElement(index)}
              onMouseLeave={() => {
                setHoverElement(null);
                setOpenModal(null);
              }}
            >
              <img 
                src={
                  !item?.foto ? 'icone_usuario.svg' : 
                  item?.foto === 'icone_usuario.svg' || item?.foto?.startsWith('http') || item?.foto?.startsWith('data') ? 
                    item.foto : 
                    `https://futuremind-2-0.onrender.com${item.foto}`
                } 
                alt="" 
              />
              <div className="nome">
                <p>{item.nome.split(' ')[0]}</p>
              </div>
              {hoverElement === index && (
                <div className="config-chat">
                  <img
                    onClick={() => setOpenModal(index)}
                    src="more.png"
                    alt=""
                  />
                </div>
              )}
              {openModal === index && hoverElement === index && (
                <div className="modal-excluir">
                  <button
                    className="btn-ocultar"
                    onClick={() => ocultaChat(index)}
                  >
                    {!ocultos.includes(item) ? 'Ocultar' : 'Desocultar'}
                  </button>
                  <button
                    className="btn-excluir"
                    onClick={() => excluiChat(item, index)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}

          {result.length === 0 && useResult && (
            <p className="no-results">Não há resultados para esta busca.</p>
          )}
        </div>
        <div className="barra-final-maior">
          <div className="barra-final"></div>
        </div>
      </div>

      {chatSelected ? (
        <div className={`chat ${isChatSelected}`}>
          <div className="barra-top">
            <div className="img-foto">
              <img 
                src={
                  !chatSelected?.foto ? 'icone_usuario.svg' : 
                  chatSelected?.foto === 'icone_usuario.svg' || chatSelected?.foto?.startsWith('http') ? 
                    chatSelected.foto : 
                    `https://futuremind-2-0.onrender.com${chatSelected.foto}`
                } 
                alt="" 
              />
            </div>
            <div className="nome-user-chat">
              <h5>{chatSelected.nome.split(' ')[0]}</h5>
            </div>
            <div className="icons-chat">
              <div className="icons-chat-p">
                <img 
                  src={cam} 
                  onClick={() => navigate(`/live/${chatSelected?.id_profissional || chatSelected?.id_paciente}`)} 
                  className="icon-chat-p-1" 
                  alt="" 
                />
                <img src={block} className="icon-chat-p-2" alt="" />
              </div>
              <img
                onClick={() => {
                  setChatSelected(null);
                  setIsChatSelected("chat-not-selected");
                }}
                src={close}
                className="icon-chat-p-3"
                alt=""
              />
            </div>
          </div>
          <div style={{ height: "83%", overflowY: "auto" }}>
            <div className="messages-div">
              {userType === 'Paciente' && (
                <div className="acess-profile-div">
                  {chatSelected.nome?.split(' ')[1] ? (
                    <div className="user-name">
                      {`@${chatSelected.nome?.split(' ')[0].toLowerCase()}.${chatSelected.nome?.split(' ')[1].toLowerCase()}`}
                    </div>
                  ) : (
                    <div className="user-name">
                      {`@${chatSelected.nome?.split(' ')[0].toLowerCase()}`}
                    </div>
                  )}
                  <div className="btn-acess">
                    <b onClick={acessaPerfil}>Acessar perfil</b>
                  </div>
                </div>
              )}
              <div className="arvore-chat">
                {theme === "light" ? (
                  <img src={arvoreAzul} alt="" />
                ) : (
                  <img src={arvoreBranca} alt="" />
                )}
              </div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.mensageiro === userType ? "message-right" : "message-left"}
                >
                  {msg.mensageiro !== userType && (
                    <div className="image-message-left">
                      <img 
                        src={
                          !chatSelected?.foto ? 'icone_usuario.svg' : 
                          chatSelected?.foto === 'icone_usuario.svg' || chatSelected?.foto?.startsWith('http') ? 
                            chatSelected.foto : 
                            chatSelected?.foto?.startsWith('data') ? 
                              'icone_usuario.svg' : 
                              `https://futuremind-2-0.onrender.com${chatSelected.foto}`
                        } 
                        alt="" 
                      />
                    </div>
                  )}
                  <div
                    onMouseEnter={() => msg.mensageiro === userType && setHoverMessage(index)}
                    onMouseLeave={() => {
                      msg.mensageiro === userType && 
                      setHoverMessage(null); setOpenModalMessage(openModalMessage);
                    }}
                    className={msg.mensageiro === userType ? "text-message-right" : "text-message-left"}
                  >
                    {msg.mensagem}
                    {hoverMessage === index && (
                      <div className="config-msg">
                        <img
                          onClick={() => setOpenModalMessage(index)}
                          src="more (1).png"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                  {msg.mensageiro === userType && (
                    <div className="image-message-right">
                      <img 
                        src={
                          !user?.foto ? 'icone_usuario.svg' : 
                          user?.foto === 'icone_usuario.svg' || user?.foto?.startsWith('http') ? 
                            user.foto : 
                            user?.foto?.startsWith('data') ? 
                              'icone_usuario.svg' : 
                              `https://futuremind-2-0.onrender.com${user.foto}`
                        } 
                        alt="" 
                      />
                    </div>
                  )}
                  {openModalMessage === index && (
                    <div className="modal-excluir-msg" ref={messageRef}>
                      <button
                        className="btn-ocultar"
                        onClick={() => ocultaMensagem(index)}
                      >
                        Ocultar
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => excluiMensagem(msg, index)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
          <form onSubmit={sendMessage} className="barra-bottom">
            <div className="inpt-chat">
              <input
                type="text"
                placeholder="Envie uma mensagem..."
                value={inptvalue}
                onChange={(e) => setInptvalue(e.target.value)}
              />
            </div>
            <div className="icons-chat-inpt">
              <img onClick={sendMessage} src="send-message.png" className="hand-click" alt="" />
            </div>
          </form>
        </div>
      ) : (
        <div className="no-chat-selected">
          <h2>Selecione uma conversa</h2>
          <p>Escolha um chat para visualizar as mensagens aqui.</p>
        </div>
      )}
    </div>
  );
}

export default Chat;