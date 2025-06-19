import voltar from "../assets/seta-principal.svg";
import config from "../assets/settings.svg";
import help from "../assets/help 1.svg";
import lupa from "../assets/search 1.svg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import close from "../assets/close-2.svg";
import cam from "../assets/cam-recorder (1) 1.svg";
import block from "../assets/blocked 1.svg";
import arvoreAzul from "../assets/Arvore Azul.svg";
import arvoreBranca from "../assets/Arvore Branca.svg";
import io from "socket.io-client";
import "./CSS/Chat.css";

function Chat({
  idChatSelected,
  setIdChatSelected,
  profissionalSelected,
  setIsInChat,
}) {
  const [chats, setChats] = useState([]);
  const [chatSelected, setChatSelected] = useState(
    idChatSelected ? profissionalSelected : null
  );
  const user = JSON.parse(localStorage.getItem("User-Profile"));
  const userType = user.id_paciente ? "Paciente" : "Profissional";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem("User-Profile"));

        if (!userLocal) {
          console.log("Usuário não encontrado no localStorage");
          return;
        }

        const data = {
          fk_id: userLocal.id_profissional || userLocal.id_paciente,
          userType: userLocal.id_profissional ? "Profissional" : "Paciente",
        };

        const response = await fetch(
          "https://futuremind-2-0.onrender.com/chats",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Garantia final contra duplicatas
          const uniqueChats = data.filter(
            (chat, index, self) =>
              index ===
              self.findIndex(
                (c) =>
                  c.id_profissional === chat.id_profissional &&
                  c.id_paciente === chat.id_paciente
              )
          );

          setChats(uniqueChats);
        } else {
          console.log("Erro ao encontrar chats");
        }
      } catch (error) {
        console.error({ Erro: error });
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (chatSelected) {
      const fetchMessages = async (id) => {
        try {
          let dado = {};

          if (userType === "Profissional") {
            dado = {
              id_paciente: id,
              id_profissional: user.id_profissional,
            };
          } else if (userType === "Paciente") {
            dado = {
              id_profissional: id,
              id_paciente: user.id_paciente,
            };
          }

          if (!dado) return console.log("erro N");

          const response = await fetch(`http://localhost:4242/chats/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dado),
          });

          if (response.ok) {
            const data = await response.json();

            setMessages(data);
          } else {
            console.log("erro");
          }
        } catch (error) {
          console.error("Erro interno do servidor", error);
        }
      };

      const idAux =
        userType === "Profissional"
          ? chatSelected.id_paciente
          : chatSelected.id_profissional;
      fetchMessages(idAux);
    }
  }, [chatSelected]);

  const [isChatSelected, setIsChatSelected] = useState("chat-not-selected");
  const [busca, setBusca] = useState("");
  const [result, setResult] = useState([]);
  const [useResult, setUseResult] = useState(false);
  const [visibleSettings, setVisibleSettings] = useState(false);
  const settingsRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const tema = theme === "light" ? "escuro" : "claro";
  const [fontSize, setFontSize] = useState("medium");
  const [filters, setFilters] = useState([
    { text: "Ocultos", active: false },
    { text: "A-Z", active: false },
    { text: "Antigas", active: false },
  ]);
  const [ocultos, setOcultos] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [inptvalue, setInptvalue] = useState("");
  const [mostrarLogo, setMostrarLogo] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const timer = setTimeout(() => setMostrarLogo(false), 500);
      return () => clearTimeout(timer);
    }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleFontSize = () => {
    setFontSize((prevSize) => {
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
    if (item.active) {
      if (item.text === "A-Z") {
        const sortedChats = [...chats].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setResult(sortedChats);
        setUseResult(true);
      } else if (item.text === "Antigas") {
        const oldToNewChats = [...chats].reverse();
        setResult(oldToNewChats);
        setUseResult(true);
      } else if (item.text === "Ocultos") {
        const filtersAux = [...filters];

        for (let i = 0; i < filtersAux.length; i++) {
          if (filtersAux[i].text !== item.text) {
            filtersAux[i].active = false;
          }
        }

        setFilters(filtersAux);
        setResult(ocultos);
        setUseResult(true);
      }
    } else {
      if (
        item.text === "A-Z" ||
        item.text === "Antigas" ||
        item.text === "Ocultos"
      ) {
        setUseResult(false);
      }
    }
  };

  const socket = useRef();

 useEffect(() => {
  if (!socket.current) {
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      console.log("Conectado ao Socket.IO!");
    });

    socket.current.on("connect_error", (err) => {
      console.error("Erro de conexão:", err);
    });
  }

  // Entra na sala do chat selecionado
  if (chatSelected) {
    const roomId = `chat_${
      userType === "Profissional"
        ? user.id_profissional + "_" + chatSelected.id_paciente
        : user.id_paciente + "_" + chatSelected.id_profissional
    }`;
    socket.current.emit("joinRoom", roomId); // Entra na sala
  }

  // Listener para novas mensagens
  const handleNewMessage = (savedMessage) => {
    console.log("Nova mensagem recebida:", savedMessage);

    if (!chatSelected) return;

    const isRelevantMessage =
      // Profissional recebendo mensagem do paciente atual
      (userType === "Profissional" &&
        savedMessage.userType === "Paciente" &&
        savedMessage.id_paciente === chatSelected.id_paciente &&
        savedMessage.id_profissional === user.id_profissional) ||
      // Paciente recebendo mensagem do profissional atual
      (userType === "Paciente" &&
        savedMessage.userType === "Profissional" &&
        savedMessage.id_profissional === chatSelected.id_profissional &&
        savedMessage.id_paciente === user.id_paciente);

    if (isRelevantMessage) {
      setMessages((prev) => [...prev, savedMessage]);
    }
  };

  socket.current.off("receiveMessage");
  socket.current.on("receiveMessage", handleNewMessage);

  return () => {
    socket.current?.off("receiveMessage", handleNewMessage);
  };
}, [chatSelected, userType, user.id_profissional, user.id_paciente]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function buscaProfissional(e) {
    const termo = e.target.value;
    setBusca(termo.toLowerCase());

    if (termo === "") {
      setResult([]);
      setUseResult(false);
      return;
    }

    const filtrados = chats.filter((chat) =>
      chat.nome.toLowerCase().includes(termo)
    );
    setResult(filtrados || []);
    setUseResult(true);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setVisibleSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDateTimeNow = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inptvalue.trim() || !chatSelected) return;

    const newMessage = {
      datahora: getDateTimeNow(),
      mensageiro: userType,
      mensagem: inptvalue,
      id_paciente:
        userType === "Profissional"
          ? chatSelected.id_paciente
          : user.id_paciente,
      id_profissional:
        userType === "Paciente"
          ? chatSelected.id_profissional
          : user.id_profissional,
      roomId: `chat_${
        userType === "Profissional"
          ? user.id_profissional + "_" + chatSelected.id_paciente
          : user.id_paciente + "_" + chatSelected.id_profissional
      }`, // ID único para a sala
    };

    setInptvalue("");
    fetchSendMessage(newMessage);
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const fetchSendMessage = async (message) => {
    try {
      const response = await fetch(
        "http://localhost:4242/chats/chat/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }
      );

      if (response.ok) {
        console.log("a");
        console.log("Mensagem salva no banco de dados!");
        socket.current.emit("sendMessage", message);
        setMessages((prev) => [...prev, message]); // Otimista
      }
    } catch (error) {
      console.error(error);
    }
  };

  const encaminharPerfil = () => {
    if (userType === "Paciente") {
      if (profissionalSelected) {
        setIsInChat(false);
        setIdChatSelected(chatSelected.id_profissional);
      } else {
        setIdChatSelected(chatSelected.id_profissional);
        navigate(`profissional/${chatSelected.id_profissional}`);
      }
    }
  };

  const messageRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setOpenModalMessage(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [hoverElement, setHoverElement] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [hoverMessage, setHoverMessage] = useState(null);
  const [openModalMessage, setOpenModalMessage] = useState(null);

  const ocultaMensagem = (index) => {
    const messagesAux = [...messages];
    messagesAux.splice(index, 1);
    setMessages(messagesAux);
    setOpenModalMessage(null);
  };

  const excluiMensagem = async (mensagem, index) => {
    try {
      let data = {};

      if (userType === "Profissional") {
        data = {
          id_profissional: user.id_profissional,
          id_paciente: mensagem.fk_pacientes_id_paciente,
          datahora: mensagem.datahora,
        };
      } else if (userType === "Paciente") {
        data = {
          id_paciente: user.id_paciente,
          id_profissional: mensagem.fk_profissionais_id_profissional,
          datahora: mensagem.datahora,
        };
      }

      if (!data) return console.log("Erro ao carregar dados");

      const response = await fetch("http://localhost:4242/chats/mensagens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
    setOpenModal(null);
    setOcultos((prev) => [...prev, ocultedChat]);
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

      const response = await fetch("http://localhost:4242/chats", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <>
    {
      mostrarLogo ? (
        <div className="logo-container">
          <div className="logo-elements">
              <h2 className="loading-animation">Carregando...</h2>    
          </div>
        </div>
    ) : (
    <div className={`container-chats ${theme} ${fontSize}`}>
      <div className="barra-lateral-chat">
        <div className="barra-cima">
          <img
            className="voltar-btn"
            onClick={handleVoltar}
            src={voltar}
            alt=""
          />
          <img
            className="config-btn"
            onClick={() => setVisibleSettings(!visibleSettings)}
            src={config}
            alt=""
            />
          {visibleSettings && (
            <div className="settings" ref={settingsRef}>
              <div className="config" onClick={toggleFontSize}>
                Tamanho da fonte
              </div>
              <div className="config" onClick={toggleTheme}>
                Tema {tema}
              </div>
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
                onChange={buscaProfissional}
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
              className={
                  item.active ? "box-pesquisa-checked" : "box-pesquisa"
                }
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
                setChatSelected(item), setIsChatSelected("chat-selected");
              }}
              onMouseEnter={() => setHoverElement(index)}
              onMouseLeave={() => {
                setHoverElement(null);
                setOpenModal(null);
              }}
              >
              <img src={`http://localhost:4242${item.foto}`} alt="" />
              <div className="nome">
                <p>{item.nome}</p>
              </div>
              {hoverElement === index && (
                <div className="config-chat">
                  <img
                    onClick={() =>
                      hoverElement === index
                        ? setOpenModal(index)
                        : setOpenModal(null)
                      }
                      src="more.png"
                      alt=""
                      />
                </div>
              )}
              {openModal === index && hoverElement === index && (
                <div className="modal-excluir">
                  <button
                    className="btn-ocultar"
                    onClick={() => {
                      ocultaChat(index);
                      setChatSelected(null);
                      setIsChatSelected("chat-not-selected");
                    }}
                    >
                    Ocultar
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
            <>
              <p className="no-results">Não há resultados para esta busca.</p>
              <img className="arvore-results" src={arvoreAzul} />
            </>
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
              <img src={`http://localhost:4242${chatSelected.foto}`} alt="" />
            </div>
            <div className="nome-user-chat">
              <h5>{chatSelected.nome}</h5>
            </div>
            <div className="icons-chat">
              <div className="icons-chat-p">
                <img src={cam} className="icon-chat-p-1" alt="" />
                <img src={block} className="icon-chat-p-2" alt="" />
              </div>
              <img
                onClick={() => {
                  setChatSelected(null), setIsChatSelected("chat-not-selected");
                }}
                src={close}
                className="icon-chat-p-3"
                alt=""
                />
            </div>
          </div>
          <div style={{ height: "83%", overflowY: "auto" }}>
            <div className="messages-div">
              <div className="acess-profile-div">
                <div className="user-name">@jana.silvaa</div>
                <div className="btn-acess">
                  <b onClick={encaminharPerfil}>Acessar perfil</b>
                </div>
              </div>
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
                className={
                  msg.mensageiro === userType
                  ? "message-right"
                  : "message-left"
                }
                >
                  {msg.mensageiro === !userType && (
                    <div className="image-message-right">
                      <img src={user.foto} alt="" />
                    </div>
                  )}
                  <div
                    onMouseEnter={() =>
                      msg.mensageiro === userType && setHoverMessage(index)
                    }
                    onMouseLeave={() => {
                      msg.mensageiro === userType &&
                      (setHoverMessage(null),
                      setOpenModalMessage(openModalMessage));
                    }}
                    className={
                      msg.mensageiro === userType
                      ? "text-message-right"
                      : "text-message-left"
                    }
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
                  {openModalMessage === index && (
                    <div className="modal-excluir-msg" ref={messageRef}>
                      <button
                        className="btn-ocultar"
                        onClick={() => {
                          ocultaMensagem(index);
                          setChatSelected(null);
                          setIsChatSelected("chat-not-selected");
                        }}
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
                  {msg.mensageiro === userType && (
                    <div className="image-message-left">
                      <img src={user.foto} alt="" />
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
              <button type="submit">
                <img src="message (1).png" className="hand-click" alt="" />
              </button>
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
    )}
    </>
  );
}

export default Chat;
