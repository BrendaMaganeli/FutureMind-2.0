import voltar from '../assets/seta-principal.svg';
import config from '../assets/settings.svg';
import help from '../assets/help 1.svg';
import mulher from '../assets/image 8.png';
import lupa from '../assets/search 1.svg';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import close from '../assets/close-2.svg';
import cam from '../assets/cam-recorder (1) 1.svg';
import block from '../assets/blocked 1.svg';
import arvoreAzul from '../assets/Arvore Azul.svg';
import arvoreBranca from '../assets/Arvore Branca.svg';
import io from "socket.io-client";
import "./CSS/Chat.css";

function Chat() {
  
  const [chats, setChats] = useState([]);
  const [chatSelected, setChatSelected] = useState();
  const user = JSON.parse(localStorage.getItem('User-Profile'));
  const userType = user.id_paciente ? 'Paciente' : 'Profissional';
  const [isMine, setIsMine] = useState(true);

  useEffect(() => {

    const fetchChats = async() => {
  
      try {
  
        const userLocal = JSON.parse(localStorage.getItem('User-Profile'));
  
          if (!userLocal) {
              console.log('Usuário não encontrado no localStorage');
              return;
          }
  
          const data = {
              fk_id: userLocal.id_profissional || userLocal.id_paciente,
              userType: userLocal.id_profissional ? 'Profissional' : 'Paciente'
          };
        
        const response = await fetch("https://futuremind-2-0.onrender.com/chats", {
  
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (response.ok) {
  
          const data = await response.json();
  
          if (data.length === 0) {
  
            console.log('Nenhum chat encontrado!');
          }
          setChats(data);
        } else {
  
          console.log('Erro ao encontrar chats');
        }
      } catch (error) {
       
        console.error({Erro: 'Internal Server Error'});
      };
    };

    fetchChats();
  }, []);

  

  useEffect(() => {

    if (chatSelected) {

      const fetchMessages = async(id) => {
        
        try {

          let dado = {};
          
          if (userType === 'Profissional') {
            dado = {
              
              id_paciente: id,
              id_profissional: user.id_profissional
            }
          } else if (userType === 'Paciente') {
            
            dado = {
              
              id_profissional: id,
              id_paciente: user.id_paciente
            }
          }

          if (!dado) return console.log('erro N');
          
          const response = await fetch(`https://futuremind-2-0.onrender.com/chats/chat`, {
            
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dado)
          });
          
          if (response.ok) {
            
            const data = await response.json();
            
            setMessages(data);
          } else {

            console.log('erro')
          }
        } catch (error) {
          
          console.error('Erro interno do servidor', error);
        }
      }

      const idAux = userType === 'Profissional' ? chatSelected.id_paciente : chatSelected.id_profissional;
      fetchMessages(idAux);
    }
  }, [chatSelected]);


  // const socket = io("https://futuremind-2-0.onrender.com");


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
    { text: "3 não lidas", active: false },
    { text: "A-Z", active: false },
    { text: "Antigas", active: false },
  ]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [inptvalue, setInptvalue] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleFontSize = () => {
    setFontSize((prevSize) => {
      if (prevSize === "small") return "medium";
      if (prevSize === "medium") return "large";
      return "small";
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
          a.nome.localeCompare(b.nome),
        );
        setResult(sortedChats);
        setUseResult(true);
      } else if (item.text === "Antigas") {
        const oldToNewChats = [...chats].reverse();
        setResult(oldToNewChats);
        setUseResult(true);
      }
    } else {
      if (item.text === "A-Z" || item.text === "Antigas") {
        setUseResult(false);
      }
    }
  };

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
      chat.nome.toLowerCase().includes(termo),
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (inptvalue.trim() === "") return;

    const newMessage = {
      mensageiro: userType,
      datahora: '2025-05-08 12:00:00',
      mensagem: inptvalue,
      id_paciente: userType === 'Profissional' ? chatSelected.id_paciente : user.id_paciente,
      id_profissional: userType === 'Paciente' ? chatSelected.id_profissional : user.id_profissional
    };
    setInptvalue("");
    fetchSendMessage(newMessage);
    window.reLoad;
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const fetchSendMessage = async(message) => {

    try {
      
      const response = await fetch('https://futuremind-2-0.onrender.com/chats/chat/send-message', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {

        console.log('Mensagem enviada!');
        const data = await response.json();

        setMessages([...messages, data]);
      }
    } catch (error) {
      
      console.error(error);
    }
  }

  return (
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
            >
              <img src={item.foto} alt="" />
              <div className="nome">
                <p>{item.nome}</p>
              </div>
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
              <img src={chatSelected.foto} alt="" />
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
                  setChatSelected(""), setIsChatSelected("chat-not-selected");
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
                  <b>Acessar perfil</b>
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
                    msg.mensageiro === userType ? "message-right" : "message-left"
                  }
                >
                  {!msg.mensageiro === userType && (
                    <div className="image-message-right">
                      <img src={user.foto} alt="" />
                    </div>
                  )}
                  <div
                    className={
                     msg.mensageiro === userType
                        ? "text-message-right"
                        : "text-message-left"
                    }
                  >
                    {msg.mensagem}
                  </div>
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
                placeholder="Enter a message..."
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
  );
}

export default Chat;
