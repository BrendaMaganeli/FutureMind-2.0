import "./CSS/VisualizarProfissional.css";
import icon_um from "../assets/agenda 2.svg";
import icon_dois from "../assets/cam-recorder (1) 11.svg";
import icon_tres from "../assets/comments-regular.svg";
import logo from "../assets/logo-prin.png";
import voltar from "../assets/seta-principal.svg";
// import anotar from "../assets/bloco-de-anotacoes.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Arvore from '../assets/Arvore-perfil.svg'
import Chat from "./Chat";

function VisualizarProfissional() {

  const [profissional, setProfissional] = useState({});

  const { id } = useParams();
  const [idChatSelected, setIdChatSelected] = useState(id);

  const renderizarPerfil = async() => {

    try {
      
      const response = await fetch(`https://futuremind-2-0.onrender.com/profissional/${idChatSelected}`, {

        method: 'GET',       
      });

      if (response.ok) {

        const data = await response.json();
        const especializacoes = JSON.parse(data.especializacao || "[]");
        const abordagens = JSON.parse(data.abordagem || "[]");
  
        setProfissional({
          ...data,
          especializacoes,
          abordagens
        });
      }
    } catch (err) {
      
      console.log('Erro no servidor, erro: ', err);
    };
  };
  
  useEffect(() => {

    renderizarPerfil();
  }, []);

  const encaminharChat = () => {

    setIsInChat(true);
  }

  const [isInChat, setIsInChat] = useState(false);
  
  
  return (
    <>
    {
      isInChat
      ?
      <Chat idChatSelected={idChatSelected} profissionalSelected={profissional} setIdChatSelected={setIdChatSelected} setIsInChat={setIsInChat} />
      :
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
            <img src={profissional.foto} alt="Foto do perfil" className="imagem-perfil" />
            <h2 className="nome-perfil">{profissional?.nome}</h2>
          </div>
          {/* <div className="experiencia-perfil">
            <h3>Experiência</h3>
            <div className="cartao-experiencia">
              <strong>Cargo</strong> <span className="ano">Ano</span>
              <p>Breve descrição.</p>
            </div>
            <div className="cartao-experiencia">
              <strong>Cargo</strong> <span className="ano">Ano</span>
              <p>Breve descrição.</p>
            </div>
            <button className="botao-baixar">Baixar currículo</button>
          </div> */}
        </div>
        <div className="caixa-comandos">
          <div className="cartao-informacao">
            <div className="cabecalho-informacao">
              <h2>Funções</h2>
            </div>
          </div>
          <div className="funcionalidades">
            <div className="topicos">
              <img src={icon_um} alt="" />
              <p>Agende sua cosulta</p>
            </div>
            <div className="topicos">
              <img src={icon_dois} alt="" />
              <p>Vídeo Chamada</p>
            </div>
            <div className="topicos">
              <img src={icon_tres} alt="" />
              <p onClick={encaminharChat}>Chat</p>
            </div>
            {/* <div className="topicos">
              <img src={anotar} alt="" />
              <p>Anotações</p>
            </div> */}
          </div>
        </div>
      </aside>

      <main className="conteudo">
        <div className="arvore">
          <img src={Arvore} alt="" />
        </div>

        <div className="botoes-maior">
          <div className="botoes">
            <img src={voltar} alt="" />
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
                <p className="abordagens-especializacoes" key={index}>{item.label}</p>
              ))}
              </div>
            </div>
            <div className="cartao-informacao-a">
              <div className="cabecalho-informacao">
                <h2>Abordagem</h2>
              </div>
              <div className="corpo-informacao">
              {profissional.abordagens?.map((item, index) => (
                <p className="abordagens-especializacoes" key={index}>{item.label}</p>
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
    }
    </>
  );
}

export default VisualizarProfissional;
