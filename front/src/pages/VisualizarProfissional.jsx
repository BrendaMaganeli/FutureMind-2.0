import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CSS/VisualizarProfissional.css";
import { GlobalContext } from "../Context/GlobalContext";
import ModalLogin from "../Components/ModalLogin";
import ModalUserProfi from "../Components/ModalUserProfi";
import Chat from "./Chat";
import icon_um from "../assets/calendar-check.svg";
import icon_dois from "../assets/video.svg";
import icon_tres from "../assets/message-square (1).svg";
import logo from "../assets/logo-prin.png";
import voltar from "../assets/seta-principal.svg";
import Arvore from "../assets/Arvore-perfil.svg";
import iconeUsuario from "../assets/iconusu.svg";

const ProfileImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(iconeUsuario);

  useEffect(() => {
    if (!src || src === 'iconusu.svg') {
      setImageSrc(iconeUsuario);
    } else if (src.startsWith('http')) {
      setImageSrc(src);
    } else {
      setImageSrc(`https://futuremind-2-0.onrender.com${src}`);
    }
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(iconeUsuario)}
    />
  );
};

const handleUserAction = (user, options) => {
  if (user?.id_paciente) {
    options.patientAction();
  } else if (user?.id_profissional) {
    options.professionalAction();
  } else {
    options.guestAction();
  }
};

function VisualizarProfissional() {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [profissional, setProfissional] = useState({});
  const [isInChat, setIsInChat] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [mostrarModalUserProfi, setMostrarModalUserProfi] = useState(false);
  const [idChatSelected, setIdChatSelected] = useState(id);

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        const response = await fetch(`https://futuremind-2-0.onrender.com/profissional/${id}`);
        
        if (!response.ok) return;

        const data = await response.json();
        
        const parseArrayField = (field) => {
          if (!field) return [];
          return typeof field === 'string' ? JSON.parse(field) : field;
        };

        setProfissional({
          ...data,
          especializacoes: parseArrayField(data.especializacao),
          abordagens: parseArrayField(data.abordagem),
          foto: data.foto || 'iconusu.svg'
        });
      } catch (error) {
        console.error("Erro ao buscar profissional:", error);
      }
    };

    fetchProfessionalData();
  }, [id]);

  const handleNavigate = (path) => navigate(path);
  const handleGoBack = () => navigate("/inicio");
  const openChat = () => setIsInChat(true);

  const renderProfessionalInfo = () => (
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
  );

  const renderActionButtons = () => (
    <div className="funcionalidades">
      <div 
        className="topicos" 
        onClick={() => handleUserAction(user, {
          patientAction: () => handleNavigate(`/agendamento/${id}`),
          professionalAction: () => setMostrarModalUserProfi(true),
          guestAction: () => setModalLogin(true)
        })}
      >
        <img src={icon_um} alt="Agendar consulta" />
        <p>Agendamento</p>
      </div>
      
      <div className="topicos">
        <img src={icon_tres} alt="Chat" />
        <p onClick={() => handleUserAction(user, {
          patientAction: openChat,
          professionalAction: () => setMostrarModalUserProfi(true),
          guestAction: () => setModalLogin(true)
        })}>Chat</p>
      </div>
      
      <div 
        className="topicos"
        onClick={() => handleUserAction(user, {
          patientAction: () => handleNavigate(`/live/${id}`),
          professionalAction: () => setMostrarModalUserProfi(true),
          guestAction: () => setModalLogin(true)
        })}
      >
        <img src={icon_dois} alt="Vídeo chamada" />
        <p>Consulta</p>
      </div>
    </div>
  );

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
            <div className="cabecalho-perfil">
              <ProfileImage 
                src={profissional?.foto}
                alt="Foto do perfil"
                className="imagem-perfil"
              />
              <h2 className="nome-perfil">{profissional?.nome}</h2>
            </div>

            <div className="caixa-comandos">
              <div className="cartao-informacao">
                <div className="cabecalho-informacao">
                  <h2>Funções</h2>
                </div>
              </div>
              {renderActionButtons()}
            </div>
          </aside>

          <main className="conteudo">
            <div className="arvore">
              <img src={Arvore} alt="Árvore decorativa" />
            </div>

            <div className="botoes-maior">
              <div className="botoes">
                <img onClick={handleGoBack} src={voltar} alt="Voltar" />
              </div>
            </div>

            <div className="loguinho">
              <img src={logo} alt="Logo" />
            </div>

            {renderProfessionalInfo()}

            <div className="crp">
              <p className="crp-design">{profissional?.crp}</p>
            </div>
          </main>
        </div>
      )}

      {modalLogin && <ModalLogin setMostrarModalLogin={setModalLogin} />}
      {mostrarModalUserProfi && <ModalUserProfi setMostrarModalUserProfi={setMostrarModalUserProfi} />}
    </>
  );
}

export default VisualizarProfissional;