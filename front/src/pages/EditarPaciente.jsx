import "./CSS/EditarPaciente.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon_um from "../assets/calendar-check.svg";
import icon_dois from "../assets/video.svg";
import icon_tres from "../assets/message-square (1).svg";
import logo from "../assets/logo-prin.png";
import voltar from "../assets/seta-principal.svg";
import Arvore from "../assets/Group 239274.svg";
import icon from "../assets/iconusu.svg";
import { GlobalContext } from "../Context/GlobalContext";

function EditarPaciente() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  // Estados para edição
  const [pacienteEditado, setPacienteEditado] = useState({
    id_paciente: user?.id_paciente || "",
    nome: user?.nome || "",
    cpf: user?.cpf || "",
    telefone: user?.telefone || "",
    email: user?.email || "",
    data_nascimento: user?.data_nascimento || "",
    senha: user?.senha || "",
  });

  // Estado para exibição (não muda até salvar)
  const [pacienteExibido, setPacienteExibido] = useState({
    nome: user?.nome || "",
    foto: user?.foto 
      ? user.foto.startsWith('http') 
        ? user.foto 
        : `http://localhost:4242${user.foto}`
      : icon
  });

  // Estado para a data formatada
  const [dataNascimentoFormatada, setDataNascimentoFormatada] = useState(
    formatarDataBrasileira(user?.data_nascimento)
  );

  // Outros estados
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [image, setImage] = useState(null);

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

  const deletarPaciente = async () => {
    try {
      const response = await fetch(
        `http://localhost:4242/paciente/${pacienteEditado.id_paciente}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.setItem("User Logado", false);
        setUser(null);
        navigate("/");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar paciente");
      }
    } catch (err) {
      console.error("Falha na conexão: ", err);
      console.log(`Erro ao deletar paciente: ${err.message}`);
    }
  };

  const sairPaciente = () => {
    localStorage.setItem("User Logado", false);
    setUser(null);
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
        ...pacienteEditado,
        data_nascimento: formatarDataParaEnvio(dataNascimentoFormatada)
      };

      const response = await fetch(`http://localhost:4242/paciente`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pacienteParaEnviar),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProfile = {
          ...data,
          foto: pacienteExibido.foto
        };
        
        setUser(JSON.stringify(updatedProfile));
        setPacienteEditado(updatedProfile);
        setPacienteExibido({
          ...pacienteExibido,
          nome: pacienteEditado.nome
        });
        setDataNascimentoFormatada(formatarDataBrasileira(data.data_nascimento));
        console.log("Dados atualizados com sucesso!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar dados");
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      console.log(`Erro ao salvar dados: ${err.message}`);
    }
  };

  const handleImagemChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        console.log("A imagem deve ter no máximo 5MB");
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        console.log("Por favor, selecione uma imagem JPEG, PNG ou GIF");
        return;
      }

      setImagemPreview(URL.createObjectURL(selectedFile));
      setImage(selectedFile);
    }
  };

  const onImageChange = async () => {
    if (!image) {
      console.log('Por favor, selecione uma imagem primeiro');
      return;
    }

    const formData = new FormData();
    formData.append('foto', image);
    formData.append('id_paciente', pacienteEditado.id_paciente);

    try {
      const response = await fetch('http://localhost:4242/paciente/foto-perfil', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar foto');
      }

      const fotoUrl = `http://localhost:4242${data.foto}`;
      
      setPacienteExibido({
        ...pacienteExibido,
        foto: fotoUrl
      });
      
      const updatedProfile = {
        ...pacienteEditado,
        foto: fotoUrl
      };

      setUser(JSON.stringify(updatedProfile));
      setPacienteEditado(updatedProfile);
      setImagemPreview(null);
      setIsVisible(false);
      console.log("Foto atualizada com sucesso!");
      
    } catch (err) {
      console.error('Erro:', err);
      console.log(`Erro ao enviar imagem: ${err.message}`);
    }
  };

  const irParaConsultas = () => {
    navigate(`/consulta/paciente/${pacienteEditado.id_paciente}`);
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
                onClick={() => navigate(`/inicio`)}
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
                    disabled={!image}
                  >
                    Salvar
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
            <p>Todos os seus dados serão permanentemente removidos.</p>
            <div className="modal-buttons">
              <button onClick={handleCloseModal} className="modal-btn-cancelar">
                Cancelar
              </button>
              <button onClick={handleConfirmarDeletar} className="modal-btn-confirmar">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarPaciente;