import "./CSS/EditarPaciente.css";
import "./CSS/EditarProfissional.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalContext";

import icon_um from "../assets/calendar-check.svg";
import icon_tres from "../assets/message-square (1).svg";
import logo from "../assets/logo-prin.png";
import voltar from "../assets/seta-principal.svg";
import Arvore from "../assets/Group 239274.svg";
import icon from "../assets/iconusu.svg";

function EditarPaciente() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  const [pacienteEditado, setPacienteEditado] = useState({
    id_paciente: user?.id_paciente || "",
    nome: user?.nome || "",
    cpf: user?.cpf || "",
    telefone: user?.telefone || "",
    email: user?.email || "",
    data_nascimento: user?.data_nascimento || "",
    senha: user?.senha || "",
  });

  const [pacienteExibido, setPacienteExibido] = useState({
    nome: user?.nome || "",
    foto: user?.foto 
      ? user.foto.startsWith('http') 
        ? user.foto 
        : `http://localhost:4242${user.foto}`
      : icon
  });

  const [dataNascimentoFormatada, setDataNascimentoFormatada] = useState(
    formatarDataBrasileira(user?.data_nascimento)
  );
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [mostrarLogo, setMostrarLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 500);
    return () => clearTimeout(timer);
  }, []);

  function formatarDataBrasileira(dataISO) {
    if (!dataISO) return "";
    if (dataISO.includes('/')) return dataISO;
    
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

  const handleDeletarClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmarDeletar = () => {
    deletarPaciente();
    setShowModal(false);
  };

  const irParaConsultas = () => {
    navigate(`/consulta/paciente/${pacienteEditado.id_paciente}`);
  };

  const deletarPaciente = async () => {
    try {
      const response = await fetch(`https://futuremind-2-0.onrender.com/paciente`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_paciente: user.id_paciente })
      });

      if (response.ok) {
        setUser(null);
        navigate("/");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar paciente");
      }
    } catch (err) {
      console.error("Falha na conexão: ", err);
    }
  };

  const sairPaciente = () => {
    localStorage.removeItem("User Logado");
    setUser(null);
    navigate("/");
  };

  const salvarEdicao = async () => {
    try {
      const pacienteParaEnviar = {
        ...pacienteEditado,
        data_nascimento: formatarDataParaEnvio(dataNascimentoFormatada)
      };

      const response = await fetch(`https://futuremind-2-0.onrender.com/paciente`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteParaEnviar),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProfile = { ...data, foto: pacienteExibido.foto };
        
        setUser(updatedProfile);
        setPacienteEditado(updatedProfile);
        setPacienteExibido({ ...pacienteExibido, nome: pacienteEditado.nome });
        setDataNascimentoFormatada(formatarDataBrasileira(data.data_nascimento));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar dados");
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const handleImagemChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Por favor, selecione uma imagem JPEG, PNG ou GIF");
      return;
    }

    setImagemPreview(URL.createObjectURL(selectedFile));
    setImage(selectedFile);
  };

  const onImageChange = async () => {
    if (!image) {
      desativar_div();
      return;
    }

    const formData = new FormData();
    formData.append('foto', image);
    formData.append('id_paciente', pacienteEditado.id_paciente);

    try {
      const response = await fetch('https://futuremind-2-0.onrender.com/paciente/foto-perfil', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Erro ao atualizar foto');

      const fotoUrl = `https://futuremind-2-0.onrender.com${data.foto}`;
      const updatedUser = { ...user, foto: fotoUrl };
      
      setPacienteExibido({ ...pacienteExibido, foto: fotoUrl });
      setUser(updatedUser);
      localStorage.setItem("User Logado", JSON.stringify(updatedUser));
      setImagemPreview(null);
      setIsVisible(false);
    } catch (err) {
      console.error('Erro:', err);
      console.log('Erro ao atualizar foto de perfil');
    }
  };

  return (
    <>
      {mostrarLogo ? (
        <div className="logo-container">
          <div className="logo-elements">
            <h2 className="loading-animation">Carregando...</h2>
          </div>
        </div>
      ) : (
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
                  src={pacienteExibido.foto}
                  alt="Foto do perfil"
                  className="imagem-perfil"
                />
                <h2 className="nome-perfil">{pacienteExibido.nome}</h2>
              </div>

              <div className="caixa-comandos-paciente">
                <div className="cartao-informacao">
                  <div className="cabecalho-informacao">
                    <h2>Funções</h2>
                  </div>
                </div>
                <div className="funcionalidades-paciente">
                  <div onClick={() => navigate('/chats')} className="topicos">
                    <img src={icon_tres} alt="" />
                    <p>Chat</p>
                  </div>
                  <div className="topicos">
                    <img src={icon_um} alt="" />
                    <p onClick={irParaConsultas}>Consultas</p>
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
                    onClick={() => navigate(-1)}
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
                    value={pacienteEditado.nome}
                    required
                    onChange={(e) =>
                      setPacienteEditado({ ...pacienteEditado, nome: e.target.value })
                    }
                  />
                  <label>Nome Completo</label>
                </div>
                <div className="floating-input-pac">
                  <input
                    type="text"
                    placeholder=" "
                    value={pacienteEditado.cpf}
                    required
                    onChange={(e) =>
                      setPacienteEditado({
                        ...pacienteEditado,
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
                    value={pacienteEditado.telefone}
                    required
                    onChange={(e) =>
                      setPacienteEditado({
                        ...pacienteEditado,
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
                    value={pacienteEditado.email}
                    required
                    onChange={(e) =>
                      setPacienteEditado({ ...pacienteEditado, email: e.target.value })
                    }
                  />
                  <label>E-mail</label>
                </div>
                <div className="floating-input-pac">
                  <input
                    type="text"
                    placeholder=" "
                    value={dataNascimentoFormatada}
                    required
                    onChange={(e) => {
                      const valorFormatado = aplicarMascaraData(e.target.value);
                      setDataNascimentoFormatada(valorFormatado);
                    }}
                  />
                  <label>Data de Nascimento</label>
                </div>
                <div className="floating-input-pac">
                  <input
                    type="password"
                    placeholder=" "
                    value={pacienteEditado.senha}
                    required
                    onChange={(e) =>
                      setPacienteEditado({ ...pacienteEditado, senha: e.target.value })
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
                    <label htmlFor="imagem" className="botao-selecionar-imagem">
                      + Selecionar Imagem
                    </label>
                    <input 
                      type="file" 
                      id="imagem" 
                      accept="image/jpeg, image/png, image/gif"
                      onChange={handleImagemChange} 
                      style={{ display: 'none' }}
                    />
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
                            : pacienteExibido.foto ? `url(${pacienteExibido.foto})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "50%",
                          width: "120px",
                          height: "120px",
                          border: "2px solid #ccc",
                        }}
                      />
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
                        Gostei, salvar
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
                  <button onClick={handleCloseModal} className="modal-btn-2">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default EditarPaciente;