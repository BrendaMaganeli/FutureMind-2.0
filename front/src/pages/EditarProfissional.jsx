import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";
import icon_um from "../assets/calendar-check.svg";
import icon_dois from "../assets/video.svg";
import icon_tres from "../assets/message-square (1).svg";
import Arvore from "../assets/Group 239274.svg";
import voltar from "../assets/seta-principal.svg";
import "./CSS/EditarProfissional.css";

function EditarProfissional() {
  const navigate = useNavigate();

  const perfilSalvo = JSON.parse(localStorage.getItem("User-Profile"));

  const [showModal, setShowModal] = useState(false);
  const [hasValueEspecializacao, setHasValueEspecializacao] = useState(false);
  const [hasValueAbordagem, setHasValueAbordagem] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [foto, setFoto] = useState('');

  const [formData, setFormData] = useState({
    id_profissional: perfilSalvo?.id_profissional || "",
    nome: perfilSalvo?.nome || "",
    cpf: perfilSalvo?.cpf || "",
    telefone: perfilSalvo?.telefone || "",
    email: perfilSalvo?.email || "",
    data_nascimento: perfilSalvo
      ? formatarDataBrasileira(perfilSalvo.data_nascimento)
      : "",
    senha: perfilSalvo?.senha || "",
    crp: perfilSalvo?.crp || "",
    foto: perfilSalvo?.foto || "",
    sobre_mim: perfilSalvo?.sobre_mim || "",
    especializacao: parseCampoArray(perfilSalvo?.especializacao),
    abordagem: parseCampoArray(perfilSalvo?.abordagem),
    valor_consulta: formatarValorConsulta(perfilSalvo?.valor_consulta || ""),
    email_profissional: perfilSalvo?.email_profissional || "",
});

const [profissionais, setProfissionais] = useState(formData);

  useEffect(() => {

    const profissionalAux = {...perfilSalvo, foto: foto};
    localStorage.setItem('User-Profile', JSON.stringify(profissionalAux));
  }, [foto]);

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

  function formatarValorConsulta(valor) {
    if (typeof valor !== "string") return "R$ 0,00";
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100 || 0).toFixed(2);
    return `R$ ${numero.replace(".", ",")}`;
  }

  function formatarValorConsultab(valor) {
    const somenteNumeros = valor.replace(/\D/g, "");
    return (parseInt(somenteNumeros, 10) / 100).toFixed(2);
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

  const [isVisible, setIsVisible] = useState(false);

  const toggleDiv = () => setIsVisible(true);
  const desativar_div = () => setIsVisible(false);

  const deletarProfissional = async () => {
    try {
      const response = await fetch(
        "http://localhost:4242/editar-profissional",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_profissional: perfilSalvo.id_profissional,
          }),
        }
      );
      if (response.ok) {
        localStorage.removeItem("User-Profile");
        navigate("/");
      }
    } catch (err) {
      console.error("Falha na conexão: ", err);
    }
  };

const salvarEdicao = async () => {
  try {
    const profissionalParaEnviar = {
      ...formData,
      data_nascimento: formatarDataParaEnvio(formData.data_nascimento),
      abordagem: JSON.stringify(formData.abordagem),
      especializacao: JSON.stringify(formData.especializacao),
      valor_consulta: formatarValorConsultab(formData.valor_consulta),
    };

    const response = await fetch("http://localhost:4242/editarprofissional", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profissionalParaEnviar),
    });

    if (response.ok) {
      const data = await response.json();
      data.valor_consulta = data.valor_consulta.toFixed(2);
      data.foto = foto;
      localStorage.setItem("User-Profile", JSON.stringify(data));
      setProfissionais(data); // Atualiza o estado de exibição com os dados salvos
      window.location.reload();
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
};

  const sairProfissional = () => {
    localStorage.setItem("User Logado", false);
    localStorage.removeItem("User-Profile");
    navigate("/");
  };

  const voltarTelas = () => {
    navigate(-1);
  };

  const handleDeletarClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmarDeletar = () => {
    deletarProfissional();
    setShowModal(false);
  };

  //fotos

  const handleImagemChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFotoSelecionada(selectedFile);
      setImagemPreview(URL.createObjectURL(selectedFile));
      setImage(selectedFile);
    }
  };

   const onImageChange = async () => {
    if (image) {
      const file = image
      console.log('Arquivo selecionado:', file);
  
      const formData = new FormData(); // Corrigir a criação do FormData
      formData.append('foto', file); // Adicionar o arquivo selecionado
      formData.append('id_profissional', perfilSalvo.id_profissional);
  
      try {
        const response = await fetch('http://localhost:4242/profissional/foto-perfil', {
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

  const navegaParaConsulta = () => {
    navigate(`/consulta/profissional/${profissionais.id_profissional}`);
  };

  return (
    <div className="container">
      <img
        onClick={toggleDiv}
        className="icone_editar"
        src="editar_icone.svg"
        alt=""
      />
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
              src={
                imagemPreview
                  ? imagemPreview
                  : perfilSalvo.foto.startsWith("http")
                  ? perfilSalvo.foto
                  : `http://localhost:4242${perfilSalvo.foto}`
              }
              alt="Foto do perfil"
              className="imagem-perfil"
            />
            <h2 className="nome-perfil">{profissionais.nome}</h2>
          </div>
          <div className="textarea-wrapper" style={{ width: "20rem" }}>
            <div
              style={{ position: "relative", width: "100%", minWidth: "200px" }}
            >
              <textarea
                className="textarea-custom"
                placeholder=" "
                value={profissionais.sobre_mim}
                onChange={(e) =>
                  setProfissionais((prev) => ({
                    ...prev,
                    sobre_mim: e.target.value,
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
            <div className="topicos">
              <img src={icon_dois} alt="" />
              <p>Vídeo Chamada</p>
            </div>
            <div className="topicos">
              <img src={icon_tres} alt="" />
              <p>Chat</p>
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
              value={profissionais.cpf}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({
                  ...prev,
                  cpf: aplicarMascaraCPF(e.target.value),
                }))
              }
            />
            <label>CPF</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={profissionais.telefone}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({
                  ...prev,
                  telefone: aplicarMascaraTelefone(e.target.value),
                }))
              }
            />
            <label>Telefone</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={profissionais.email}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <label>E-mail</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={profissionais.data_nascimento}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({
                  ...prev,
                  data_nascimento: aplicarMascaraData(e.target.value),
                }))
              }
            />
            <label>Data de Nascimento</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="password"
              placeholder=" "
              value={profissionais.senha}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({ ...prev, senha: e.target.value }))
              }
            />
            <label>Senha</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={profissionais.crp}
              required
              maxLength={8}
              onChange={(e) =>
                setProfissionais((prev) => ({ ...prev, crp: e.target.value }))
              }
            />
            <label>CRP</label>
          </div>

          <div className="floating-input-pac">
            <input
              type="text"
              placeholder=" "
              value={profissionais.valor_consulta}
              required
              onChange={(e) => {
                const formatado = formatarValorConsulta(e.target.value);
                setProfissionais((prev) => ({
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
                profissionais.especializacao,
                opcoesEspecializacao
              )}
              onChange={(selectedOptions) => {
                const novos = selectedOptions.map((opt) => opt.value);
                setProfissionais((prev) => ({
                  ...prev,
                  especializacao: novos,
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
                profissionais.abordagem,
                opcoesAbordagens
              )}
              onChange={(selectedOptions) => {
                const novos = selectedOptions.map((opt) => opt.value);
                setProfissionais((prev) => ({
                  ...prev,
                  abordagem: novos,
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
              value={profissionais.email_profissional}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({
                  ...prev,
                  email_profissional: e.target.value,
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

export default EditarProfissional;
