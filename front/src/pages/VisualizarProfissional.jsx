import "./CSS/VisualizarProfissional.css";
import icon_um from "../assets/calendar-check.svg";
import icon_dois from "../assets/video.svg";
import icon_tres from "../assets/message-square (1).svg";
import logo from "../assets/logo-prin.png";
import voltar from "../assets/seta-principal.svg";
import Arvore from "../assets/Arvore-perfil.svg";
import ModalLogin from "../Components/ModalLogin";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Chat from "./Chat";

function VisualizarProfissional() {

  const user = JSON.parse(localStorage.getItem('User-Profile'));
  const [profissional, setProfissional] = useState({});
  const [isInChat, setIsInChat] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);

  const { id } = useParams();
  const [idChatSelected, setIdChatSelected] = useState(id);
  const navigate = useNavigate();

  const encaminhaAgendamento = () => {
    navigate(`/agendamento/${id}`);
  };

  const encaminharChat = () => {
    setIsInChat(true);
  };

  const renderizarPerfil = async () => {
    try {
      const response = await fetch(
        `https://futuremind-2-0.onrender.com/profissional/${idChatSelected}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Verifica se os dados são strings e faz o parse
        const especializacoes = typeof data.especializacao === 'string' 
          ? JSON.parse(data.especializacao || "[]") 
          : data.especializacao || [];
        
        const abordagens = typeof data.abordagem === 'string'
          ? JSON.parse(data.abordagem || "[]")
          : data.abordagem || [];

        setProfissional({
          ...data,
          especializacoes: Array.isArray(especializacoes) ? especializacoes : [],
          abordagens: Array.isArray(abordagens) ? abordagens : [],
        });
      }
    } catch (err) {
      console.log("Erro no servidor, erro: ", err);
    }
  };

  useEffect(() => {
    renderizarPerfil();
  }, []);

  const voltarTelas = () => {
    navigate("/inicio");
  };

  return (
    <>
      {isInChat ? (
        <Chat
          idChatSelected={idChatSelected}
          profissionalSelected={profissional}
          setIdChatSelected={setIdChatSelected}
          setIsInChat={setIsInChat}
        />
      ) : (
        <div className="container">
          <aside className="barra-lateral">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
                height: "fit-content",
                alignItems: "center",
              }}
            >
              <div className="cabecalho-perfil">
                <img
                  src={`http://localhost:4242${profissional.foto}`}
                  alt="Foto do perfil"
                  className="imagem-perfil"
                />
                <h2 className="nome-perfil">{profissional?.nome}</h2>
              </div>
            </div>

            <div className="caixa-comandos">
              <div className="cartao-informacao">
                <div className="cabecalho-informacao">
                  <h2>Funções</h2>
                </div>
              </div>
              <div className="funcionalidades">
                <div className="topicos" onClick={() => {
                      user 
                      ? 
                      navigate(`/agendamento/${id}`) 
                      : 
                      setModalLogin(true);
                    }
                  }>
                  <img src={icon_um} alt="" />
                  <p>Agende sua consulta</p>
                </div>
                <div
                  onClick={() => {
                      user 
                      ?
                      navigate(`/live/${id}`)
                      :
                      setModalLogin(true);
                    }
                  }
                  className="topicos"
                >
                  <img src={icon_dois} alt="" />
                  <p>Vídeo Chamada</p>
                </div>
                <div className="topicos">
                  <img src={icon_tres} alt="" />
                  <p onClick={() => {

                      user
                      ?
                      encaminharChat
                      :
                      setModalLogin(true);
                    }
                  }
                  >Chat</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="conteudo">
            <div className="arvore">
              <img src={Arvore} alt="" />
            </div>

            <div className="botoes-maior">
              <div className="botoes">
                <img onClick={voltarTelas} src={voltar} alt="" />
              </div>
            </div>

            <div className="loguinho">
              <img src={logo} alt="" />
            </div>

            <div className="caixa-info-geral">
              <div className="cartao-sobremim">
                <div className="cabecalho-sobre-mim">
                  <h2>Sobre mim</h2>
                </div>
                <div className="corpo-sobre-mim">
                  <p>{profissional?.sobre_mim}</p>
                </div>
              </div>

              <div className="caixa-informacoes">
                <div className="cartao-informacao-e">
                  <div className="cabecalho-informacao">
                    <h2>Especialização</h2>
                  </div>
                  <div className="corpo-informacao">
                    {profissional.especializacoes?.map((item, index) => (
                      <p className="abordagens-especializacoes" key={index}>
                        {typeof item === 'object' ? item.label : item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="cartao-informacao-a">
                  <div className="cabecalho-informacao">
                    <h2>Abordagem</h2>
                  </div>
                  <div className="corpo-informacao">
                    {profissional.abordagens?.map((item, index) => (
                      <p className="abordagens-especializacoes" key={index}>
                        {typeof item === 'object' ? item.label : item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="crp">
              <p className="crp-design">{profissional?.crp}</p>
            </div>
          </main>
        </div>
      )}
      {
        modalLogin &&
        <ModalLogin setMostrarModalLogin={setModalLogin} />
      }
    </>
  );
}

export default VisualizarProfissional;