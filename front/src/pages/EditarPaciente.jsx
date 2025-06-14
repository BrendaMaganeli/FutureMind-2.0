import "./CSS/EditarPaciente.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon_um from "../assets/calendar-check.svg";
import icon_dois from "../assets/video.svg";
import icon_tres from "../assets/message-square (1).svg";
import logo from "../assets/logo-prin.png";
import voltar from "../assets/seta-principal.svg";
import Arvore from "../assets/Group 239274.svg";

function EditarPaciente() {
  const navigate = useNavigate();

  const pacienteLocal = JSON.parse(localStorage.getItem("User-Profile"));

  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [foto, setFoto] = useState(`http://localhost:4242${pacienteLocal.foto}`);

  const [paciente, setPaciente] = useState({
    id_paciente: pacienteLocal.id_paciente,
    nome: pacienteLocal.nome,
    cpf: pacienteLocal.cpf,
    telefone: pacienteLocal.telefone,
    email: pacienteLocal.email,
    data_nascimento: formatarDataBrasileira(pacienteLocal.data_nascimento),
    senha: pacienteLocal.senha,
  });

  useEffect(() => {

    const pacienteAux = {...pacienteLocal, foto: foto};
    localStorage.setItem('User-Profile', JSON.stringify(pacienteAux));
  }, [foto]);

  function formatarDataBrasileira(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataParaEnvio(dataBR) {
    if (!dataBR.includes("/")) return dataBR;
    const [dia, mes, ano] = dataBR.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  function aplicarMascaraCPF(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function aplicarMascaraTelefone(valor) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  }

  function aplicarMascaraData(valor) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\/\d{4})\d+?$/, "$1");
  }

  const toggleDiv = () => setIsVisible(true);
  const desativar_div = () => setIsVisible(false);

  const deletarPaciente = async () => {
    try {
      const response = await fetch(
        `http://localhost:4242/paciente/${paciente.id_paciente}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.setItem("User Logado", false);
        localStorage.removeItem("User-Profile");
        navigate("/");
      }
    } catch (err) {
      console.log("Falha na conexão: ", err);
    }
  };

  const sairPaciente = () => {
    localStorage.setItem("User Logado", false);
    localStorage.removeItem("User-Profile");
    navigate("/");
  };

  const handleDeletarClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmarDeletar = () => {
    deletarPaciente();
    setShowModal(false);
  };

  const salvarEdicao = async () => {
    try {
      const pacienteParaEnviar = {
        ...paciente,
        data_nascimento: formatarDataParaEnvio(paciente.data_nascimento),
      };

      const response = await fetch(`http://localhost:4242/paciente`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pacienteParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "User-Profile",
          JSON.stringify({
            ...paciente,
            data_nascimento: pacienteParaEnviar.data_nascimento,
          })
        );
        window.location.reload();
      } else {
        console.error("Erro ao salvar:", data);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  const handleImagemChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFotoSelecionada(selectedFile);
      setImagemPreview(URL.createObjectURL(selectedFile));
      setImage(selectedFile);
    }
  };

  //fotos

   const onImageChange = async () => {
    if (image) {
      const file = image
      console.log('Arquivo selecionado:', file);
  
      const formData = new FormData(); // Corrigir a criação do FormData
      formData.append('foto', file); // Adicionar o arquivo selecionado
      formData.append('id_paciente', pacienteLocal.id_paciente);
  
      try {
        const response = await fetch('http://localhost:4242/paciente/foto-perfil', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          setFoto(imagemPreview);
          window.location.reload();
        } else {
          console.log('Erro no envio da foto:', response.status);
        }
      } catch (err) {
        console.error('Erro:', err.message);
      }
    }
  };

  const [image, setImage] = useState(null);

  const irParaConsultas = () => {
    navigate(`/consulta/paciente/${paciente.id_paciente}`);
  };

  return (
    <div>
      <img
        onClick={toggleDiv}
        className="icone_editar"
        src="editar_icone.svg"
        alt=""
      />
      <div className={`container ${isVisible ? "blur" : ""}`}>
        <aside className="barra-lateral-p">
          <div className="cabecalho-perfil-paciente">
            <img
              src={pacienteLocal.foto}
              alt="Foto do perfil"
              className="imagem-perfil"
              onClick={onImageChange}
            />
            <h2 className="nome-perfil">{pacienteLocal.nome}</h2>
          </div>
          <div className="caixa-comandos-paciente">
            <div className="cartao-informacao">
              <div className="cabecalho-informacao">
                <h2>Funções</h2>
              </div>
            </div>
            <div className="funcionalidades-paciente">
              <div className="topicos">
                <img src={icon_dois} alt="" />
                <p>Vídeo Chamada</p>
              </div>
              <div className="topicos">
                <img src={icon_tres} alt="" />
                <p>Chat</p>
              </div>
              <div className="topicos">
                <img src={icon_um} alt="" />
                <p onClick={irParaConsultas}>Consulta</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="editar-paciente-maior">
          <div className="arvore-profissional">
            <img src={Arvore} alt="" />
          </div>

          <div className="botoes-maior-p">
            <div className="botoes-p">
              <img
                src={voltar}
                alt="Voltar"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/inicio")}
              />
            </div>
            <div className="botoes-superiores-p">
              <button onClick={handleDeletarClick} className="botao-deletar">
                Deletar
              </button>
              <button onClick={sairPaciente} className="botao-sair">
                Sair
              </button>
            </div>
          </div>

          <div className="loguinho-p">
            <img src={logo} alt="" />
          </div>

          <div className="editar-paciente">
            <div className="floating-input-pac">
              <input
                type="text"
                placeholder=" "
                value={paciente.nome}
                required
                onChange={(e) =>
                  setPaciente({ ...paciente, nome: e.target.value })
                }
              />
              <label>Nome Completo</label>
            </div>
            <div className="floating-input-pac">
              <input
                type="text"
                placeholder=" "
                value={paciente.cpf}
                required
                onChange={(e) =>
                  setPaciente({
                    ...paciente,
                    cpf: aplicarMascaraCPF(e.target.value),
                  })
                }
              />
              <label>CPF</label>
            </div>
            <div className="floating-input-pac">
              <input
                type="text"
                placeholder=" "
                value={paciente.telefone}
                required
                onChange={(e) =>
                  setPaciente({
                    ...paciente,
                    telefone: aplicarMascaraTelefone(e.target.value),
                  })
                }
              />
              <label>Telefone</label>
            </div>
            <div className="floating-input-pac">
              <input
                type="text"
                placeholder=" "
                value={paciente.email}
                required
                onChange={(e) =>
                  setPaciente({ ...paciente, email: e.target.value })
                }
              />
              <label>E-mail</label>
            </div>
            <div className="floating-input-pac">
              <input
                type="text"
                placeholder=" "
                value={paciente.data_nascimento}
                required
                onChange={(e) =>
                  setPaciente({
                    ...paciente,
                    data_nascimento: aplicarMascaraData(e.target.value),
                  })
                }
              />
              <label>Data de Nascimento</label>
            </div>
            <div className="floating-input-pac">
              <input
                type="password"
                placeholder=" "
                value={paciente.senha}
                required
                onChange={(e) =>
                  setPaciente({ ...paciente, senha: e.target.value })
                }
              />
              <label>Senha</label>
            </div>
          </div>

          <div className="BTN-SALVAR">
            <button className="salvar-btn" onClick={salvarEdicao}>
              Salvar
            </button>
          </div>
        </div>
      </div>

      {isVisible && (
        <div className="container_oculto_editar">
          <div className="nav_div_oculta">
            <p className="text_editar_foto_perfil">Editar foto de perfil</p>
          </div>
          <div className="container_oculta_corpo_geral">
            <div className="container_oculta_corpo_esquerda">
              <div className="quadrado_fotos">
                <img className="fotos_editar" src="icone_usuario.svg" alt="" />
                <input type="file" id="imagem" onChange={handleImagemChange} />
              </div>
            </div>
            <div className="container_oculta_corpo_direita">
              <div className="container_info_previa">
                <div className="conatiner_previa">
                  <p className="titulo_previa">Prévia</p>
                  <p className="descricao_previa">
                    Esta foto não interfere em seus documentos oficiais
                  </p>
                </div>
                <div className="conatiner_modelo_redondo">
                  <div
                    className="modelo_foto_redondo"
                    style={{
                      backgroundImage: imagemPreview
                        ? `url(${imagemPreview})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      border: "2px solid #ccc",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="container_footer_oculto">
            <div className="footer_modelo_oculto">
              <div className="conatiner_buttons_cancelar_gostei">
                <div className="container_button_cancelar_editar">
                  <button
                    className="button_cancelar_editar"
                    onClick={desativar_div}
                  >
                    Cancelar
                  </button>
                </div>
                <div className="container_button_gostei_salvar">
                  <button
                    className="button_gostei_salvar"
                    onClick={onImageChange}
                  >
                    Gostei, Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Tem certeza de que deseja deletar sua conta?</h3>
            <div className="buttons">
              <button onClick={handleConfirmarDeletar} className="modal-btn-1">
                Sim
              </button>
              <button onClick={handleCloseModal} className="modal-btn-1">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarPaciente;
