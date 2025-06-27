import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import icon_um from "../assets/calendar-check.svg";
import icon_tres from "../assets/message-square (1).svg";
import Arvore from "../assets/Group 239274.svg";
import voltar from "../assets/seta-principal.svg";
import "./CSS/EditarProfissional.css";
import icon from "../assets/iconusu.svg";
import { GlobalContext } from "../Context/GlobalContext";

function EditarProfissional() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  const [showModal, setShowModal] = useState(false);
  const [hasValueEspecializacao, setHasValueEspecializacao] = useState(false);
  const [hasValueAbordagem, setHasValueAbordagem] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mostrarLogo, setMostrarLogo] = useState(true);

  
  const [foto, setFoto] = useState(
    user.foto?.includes('http') || user.foto === 'icone_usuario.svg'
    ? user.foto 
    : `http://localhost:4242${user.foto}` 
  );
  
  const [formData, setFormData] = useState({
    id_profissional: user?.id_profissional || "",
    nome: user?.nome || "",
    cpf: user?.cpf || "",
    telefone: user?.telefone || "",
    email: user?.email || "",
    data_nascimento: user ? formatarDataBrasileira(user.data_nascimento) : "",
    senha: user?.senha || "",
    crp: user?.crp || "",
    foto: user?.foto || "",
    sobre_mim: user?.sobre_mim || "",
    especializacao: parseCampoArray(user?.especializacao),
    abordagem: parseCampoArray(user?.abordagem),
    valor_consulta: user?.valor_consulta ? formatarValorConsulta(user.valor_consulta.toString()) : "R$ 0,00",
    email_profissional: user?.email_profissional || "",
  });

  const [profissionais, setProfissionais] = useState(formData);

  useEffect(() => {
    const profissionalAux = {...user, foto: foto};
    setUser(profissionalAux);
  }, [foto]);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 500);
     return () => clearTimeout(timer);
   }, []);
  
  const opcoesEspecializacao = [
    { value: "psicologia-clinica", label: "Psicologia Clínica" },
    { value: "psicopedagogia", label: "Psicopedagogia" },
    { value: "neuropsicologia", label: "Neuropsicologia" },
  ];

  const opcoesAbordagens = [
    { value: "cognitivo-comportamental", label: "Cognitivo-Comportamental" },
    { value: "psicanalise", label: "Psicanálise" },
    { value: "humanista", label: "Humanista" },
  ];

  // Funções auxiliares
  function formatarDataBrasileira(dataISO) {
    if (!dataISO) return "";
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

  function formatarValorConsulta(valor) {
    if (typeof valor !== "string") return "R$ 0,00";
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100 || 0).toFixed(2);
    return `R$ ${numero.replace(".", ",")}`;
  }

  function formatarValorConsultab(valor) {
    if (typeof valor !== "string") return "0.00";
    const valorLimpo = valor.replace("R$", "").trim().replace(",", ".");
    return parseFloat(valorLimpo).toFixed(2);
  }

  function parseCampoArray(campo) {
    try {
      if (!campo) return [];
      return Array.isArray(campo) ? campo : JSON.parse(campo);
    } catch {
      return [];
    }
  }

  function transformarParaOpcoesSelecionadas(valoresSalvos, opcoesDisponiveis) {
    try {
      const valoresArray = Array.isArray(valoresSalvos)
        ? valoresSalvos
        : JSON.parse(valoresSalvos || "[]");
      return opcoesDisponiveis.filter((opcao) =>
        valoresArray.includes(opcao.value)
      );
    } catch {
      return [];
    }
  }

  // Funções para manipulação de foto
  const handleImagemChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Verifica se o arquivo é uma imagem
      if (!selectedFile.type.startsWith('image/')) {
        console.log('Por favor, selecione um arquivo de imagem válido (JPEG, PNG)');
        return;
      }
      
      // Verifica o tamanho do arquivo (máximo 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        console.log('A imagem deve ter no máximo 5MB');
        return;
      }

      setFotoSelecionada(selectedFile);
      setImagemPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadFoto = async () => {
    if (!fotoSelecionada) {

      desativar_div();
      return;
    }

    const formData = new FormData();
    formData.append('foto', fotoSelecionada);
    formData.append('id_profissional', user.id_profissional);

    try {
      const response = await fetch('http://localhost:4242/profissional/foto-perfil', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Atualiza a foto com o novo caminho
        const novoCaminhoFoto = data.foto || `/uploads/${fotoSelecionada.name}`;
        const fotoCompleta = `http://localhost:4242${novoCaminhoFoto}`;
        
        setFoto(fotoCompleta);
        
        // Atualiza o contexto/user com a nova foto
        setUser(prev => ({
          ...prev,
          foto: novoCaminhoFoto
        }));
        
        // Fecha o modal e limpa os estados temporários
        setIsVisible(false);
        setImagemPreview(null);
        setFotoSelecionada(null);
      } else {
        console.error('Erro no upload da foto');
        console.log('Erro ao enviar a foto. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Erro:', err.message);
      console.log('Erro de conexão. Por favor, tente novamente.');
    }
  };

  // Funções para manipulação de dados
  const salvarEdicao = async () => {
    const valorConsultaNumerico = formatarValorConsultab(formData.valor_consulta);

    try {
      const profissionalParaEnviar = {
        ...formData,
        data_nascimento: formatarDataParaEnvio(formData.data_nascimento),
        abordagem: JSON.stringify(formData.abordagem),
        especializacao: JSON.stringify(formData.especializacao),
        valor_consulta: valorConsultaNumerico,
      };

      const response = await fetch("http://localhost:4242/editarprofissional", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profissionalParaEnviar),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.foto !== 'icone_usuario.svg') {
          data.foto = foto;
        }
        setUser(data);
        setProfissionais(data);
        console.log('Dados atualizados com sucesso!');
      } else {
        console.log('Erro ao atualizar dados. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      console.log('Erro de conexão. Por favor, tente novamente.');
    }
  };

  const deletarProfissional = async () => {
    try {
      const response = await fetch(
        "http://localhost:4242/editar-profissional",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_profissional: user.id_profissional,
          }),
        }
      );
      if (response.ok) {
        setUser(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Falha na conexão: ", err);
    }
  };

  const sairProfissional = () => {
    localStorage.setItem("User Logado", false);
    setUser(null);
    navigate("/");
  };

  const voltarTelas = () => {
    navigate(-1);
  };

  const navegaParaConsulta = () => {
    navigate(`/consulta/profissional/${profissionais.id_profissional}`);
  };

  const handleDeletarClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmarDeletar = () => {
    deletarProfissional();
    setShowModal(false);
  };

  const toggleDiv = () => setIsVisible(true);
  const desativar_div = () => {
    setIsVisible(false);
    setImagemPreview(null);
    setFotoSelecionada(null);
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

    <div className="container">
      <img
        onClick={toggleDiv}
        className="icone_editar"
        src="editar_icone.svg"
        alt="Editar foto"
        />
      
      <aside className="barra-lateral">
        <div className="cabecalho-perfil">
          <img
            src={foto}
            alt="Foto do perfil"
            className="imagem-perfil"
            onClick={toggleDiv}
            />
          <h2 className="nome-perfil">{profissionais.nome}</h2>
        </div>
        
        <div className="textarea-wrapper" style={{ width: "20rem" }}>
          <div style={{ position: "relative", width: "100%", minWidth: "200px" }}>
            <textarea
              className="textarea-custom"
              placeholder=" "
              value={formData.sobre_mim}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  sobre_mim: e.target.value
                }))
              }
              />
            <label className="label-custom">Sua descrição...</label>
          </div>
        </div>
        
        <div className="baixarButton">
          <button className="botao-baixar" onClick={salvarEdicao}>
            Salvar
          </button>
        </div>
        
        <div className="caixa-comandos-p">
          <div className="cartao-informacao">
            <div className="cabecalho-informacao">
              <h2>Funções</h2>
            </div>
          </div>
          <div className="funcionalidades-p">
            <div className="topicos">
              <img src={icon_um} alt="" />
              <p onClick={navegaParaConsulta}>Suas Consultas</p>
            </div>
            <div onClick={() => navigate('/chats')} className="topicos">
              <img src={icon_tres} alt="" />
              <p>Chat</p>
            </div>
            <div onClick={() => navigate(`/live/${user.id_profissional}`)} className="topicos">
              <img src={icon_tres} alt="" />
              <p>Vídeo Conferência</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="editar-profissional-maior">
        <div className="arvore-profissional">
          <img src={Arvore} alt="" />
        </div>

        <div className="botoes-maior-pro">
          <div className="botoes-pro">
            <img onClick={voltarTelas} src={voltar} alt="" className="voltar-seta" />
          </div>
          <div className="botoes-superiores-p">
            <button onClick={handleDeletarClick} className="botao-deletar">
              Deletar
            </button>
            <button onClick={sairProfissional} className="botao-sair">
              Sair
            </button>
          </div>
        </div>

        <div className="editar-profissional">
          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.nome}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
            <label>Nome Completo</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.cpf}
              required
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev, 
                  cpf: aplicarMascaraCPF(e.target.value)
                }))
              }
              />
            <label>CPF</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.telefone}
              required
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev, 
                  telefone: aplicarMascaraTelefone(e.target.value)
                }))
              }
              />
            <label>Telefone</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.email}
              required
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            <label>E-mail</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.data_nascimento}
              required
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev, 
                  data_nascimento: aplicarMascaraData(e.target.value)
                }))
              }
              />
            <label>Data de Nascimento</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="password"
              placeholder=" "
              value={formData.senha}
              required
              onChange={(e) => setFormData(prev => ({...prev, senha: e.target.value}))}
              />
            <label>Senha</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.crp}
              required
              maxLength={8}
              onChange={(e) => setFormData(prev => ({...prev, crp: e.target.value}))}
            />
            <label>CRP</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.valor_consulta}
              required
              onChange={(e) => {
                const formatado = formatarValorConsulta(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  valor_consulta: formatado,
                }));
              }}
            />
            <label>Preço</label>
          </div>

          <div className="floating-select-pro">
            <Select
              placeholder="Select..."
              isMulti
              className="custom-select"
              classNamePrefix="custom-select"
              options={opcoesEspecializacao}
              value={transformarParaOpcoesSelecionadas(
                formData.especializacao,
                opcoesEspecializacao
              )}
              onChange={(selectedOptions) => {
                const novos = selectedOptions.map((opt) => opt.value);
                setFormData(prev => ({
                  ...prev,
                  especializacao: novos
                }));
                setHasValueEspecializacao(novos.length > 0);
              }}
              />
            <label className={hasValueEspecializacao ? "has-value" : ""}>
              Especialização
            </label>
          </div>

          <div className="floating-select-pro">
            <Select
              placeholder="Select..."
              isMulti
              className="custom-select"
              classNamePrefix="custom-select"
              options={opcoesAbordagens}
              value={transformarParaOpcoesSelecionadas(
                formData.abordagem,
                opcoesAbordagens
              )}
              onChange={(selectedOptions) => {
                const novos = selectedOptions.map((opt) => opt.value);
                setFormData(prev => ({
                  ...prev,
                  abordagem: novos
                }));
                setHasValueAbordagem(novos.length > 0);
              }}
            />
            <label className={hasValueAbordagem ? "has-value" : ""}>
              Abordagem
            </label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={formData.email_profissional}
              required
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev, 
                  email_profissional: e.target.value
                }))
              }
              />
            <label>E-mail Profissional</label>
          </div>
        </div>

        <div className="BTN-SALVAR">
          <button className="salvar-btn" onClick={salvarEdicao}>
            Salvar
          </button>
        </div>
      </div>

      {/* Modal de Edição de Foto */}
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
                      backgroundImage: imagemPreview ? `url(${imagemPreview})` : `url(${foto})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '50%',
                      width: '120px',
                      height: '120px',
                      border: '2px solid #ccc',
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
                    onClick={uploadFoto}
                    >
                    Gostei, salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Deletar Conta */}
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
    )};
    </>
  );
}

export default EditarProfissional;