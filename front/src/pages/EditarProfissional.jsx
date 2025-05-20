import mulher from "../assets/image 8.png";
import icon_um from "../assets/agenda 2.svg";
import icon_dois from "../assets/cam-recorder (1) 11.svg";
import icon_tres from "../assets/icons8-bate-papo-48 2.svg";
import Arvore from "../assets/Group 239274.svg";
import "./CSS/EditarProfissional.css";
import voltar from "../assets/seta-principal.svg";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";

function EditarProfissional() {
  const navigate = useNavigate();
  // Se você já armazenou o perfil no localStorage ao fazer login, mantém essa lógica:
  // Caso contrário, você pode remover o JSON.parse daqui e buscar diretamente via API.
  const perfilSalvo = JSON.parse(localStorage.getItem("User-Profile"));

  // Hook para manter o estado completo do profissional
  const [profissionais, setProfissionais] = useState({
    id_profissional:    perfilSalvo?.id_profissional || "",
    nome:               perfilSalvo?.nome || "",
    cpf:                perfilSalvo?.cpf || "",
    telefone:           perfilSalvo?.telefone || "",
    email:              perfilSalvo?.email || "",
    data_nascimento:    perfilSalvo
      ? formatarDataBrasileira(perfilSalvo.data_nascimento)
      : "",
    senha:              perfilSalvo?.senha || "",
    crp:                perfilSalvo?.crp || "",
    foto:               perfilSalvo?.foto || "",
    sobre_mim:          perfilSalvo?.sobre_mim || "", // já puxa do localStorage
    especializacao:     (() => {
      try {
        if (!perfilSalvo?.especializacao) return [];
        return Array.isArray(perfilSalvo.especializacao)
          ? perfilSalvo.especializacao
          : JSON.parse(perfilSalvo.especializacao);
      } catch {
        return [];
      }
    })(),
    abordagem: (() => {
      try {
        if (!perfilSalvo?.abordagem) return [];
        return Array.isArray(perfilSalvo.abordagem)
          ? perfilSalvo.abordagem
          : JSON.parse(perfilSalvo.abordagem);
      } catch {
        return [];
      }
    })(),
    valor_consulta:     perfilSalvo
      ? `R$ ${perfilSalvo.valor_consulta.replace(".", ",")}`
      : "",
    email_profissional: perfilSalvo?.email_profissional || "",
  });

  // Se você quiser garantir sempre os dados mais recentes do banco, pode usar useEffect:
  useEffect(() => {
    // supondo que exista na sua API um GET /editarprofissional/:id para buscar o perfil
    async function buscarPerfil() {
      try {
        if (!profissionais.id_profissional) return;
        const res = await fetch(
          `http://localhost:4242/editarprofissional/${profissionais.id_profissional}`
        );
        if (!res.ok) throw new Error("Falha ao buscar perfil");
        const data = await res.json();
        // Ajusta data_nascimento para DD/MM/AAAA
        const dataFormatada = formatarDataBrasileira(data.data_nascimento);
        setProfissionais({
          id_profissional:    data.id_profissional,
          nome:               data.nome,
          cpf:                data.cpf,
          telefone:           data.telefone,
          email:              data.email,
          data_nascimento:    dataFormatada,
          senha:              data.senha,
          crp:                data.crp,
          foto:               data.foto,
          sobre_mim:          data.sobre_mim || "",
          especializacao:     Array.isArray(data.especializacao)
            ? data.especializacao
            : JSON.parse(data.especializacao || "[]"),
          abordagem: Array.isArray(data.abordagem)
            ? data.abordagem
            : JSON.parse(data.abordagem || "[]"),
          valor_consulta:     `R$ ${parseFloat(data.valor_consulta)
            .toFixed(2)
            .replace(".", ",")}`,
          email_profissional: data.email_profissional,
        });
        // Atualiza no localStorage (opcional)
        localStorage.setItem("User-Profile", JSON.stringify(data));
      } catch (err) {
        console.error(err);
      }
    }

    // Chama só se tivermos um id_profissional válido
    buscarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profissionais.id_profissional]);

  // Controle de exibição do modal de confirmação
  const [showModal, setShowModal] = useState(false);

  // Controle dos selects (para animar o label “flutuante”)
  const [hasValueEspecializacao, setHasValueEspecializacao] = useState(
    profissionais.especializacao.length > 0
  );
  const [hasValueAbordagem, setHasValueAbordagem] = useState(
    profissionais.abordagem.length > 0
  );

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
    if (!dataBR.includes("/")) {
      // caso já esteja em formato YYYY-MM-DD
      return dataBR;
    }
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
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    return `R$ ${numero.replace(".", ",")}`;
  }

  function formatarValorConsultab(valor) {
    const somenteNumeros = valor.replace(/\D/g, "");
    const numeroComPonto = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    return numeroComPonto;
  }

  function transformarParaOpcoesSelecionadas(valoresSalvos, opcoesDisponiveis) {
    try {
      const valoresArray = Array.isArray(valoresSalvos)
        ? valoresSalvos
        : JSON.parse(valoresSalvos || "[]");
      return opcoesDisponiveis.filter((opcao) =>
        valoresArray.some((valor) => valor === opcao.value)
      );
    } catch {
      return [];
    }
  }

  const deletarProfissional = async () => {
    try {
      const response = await fetch("http://localhost:4242/editarprofissional", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_profissional: profissionais.id_profissional }),
      });
      if (response.ok) {
        localStorage.setItem("User Logado", false);
        localStorage.removeItem("User-Profile");
        navigate("/");
      }
    } catch (err) {
      console.log("Falha na conexão: ", err);
    }
  };

  const sairProfissional = () => {
    localStorage.setItem("User Logado", false);
    localStorage.removeItem("User-Profile");
    navigate("/");
  };

  const handleDeletarClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmarDeletar = () => {
    deletarProfissional();
    setShowModal(false);
  };

  const salvarEdicao = async () => {
    try {
      const profissionalParaEnviar = {
        ...profissionais,
        data_nascimento: formatarDataParaEnvio(profissionais.data_nascimento),
        abordagem: JSON.stringify(profissionais.abordagem),
        especializacao: JSON.stringify(profissionais.especializacao),
        valor_consulta: formatarValorConsultab(profissionais.valor_consulta),
      };

      const response = await fetch("http://localhost:4242/editarprofissional", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profissionalParaEnviar),
      });
      if (response.ok) {
        const data = await response.json();
        data.valor_consulta = data.valor_consulta.toFixed(2);
        localStorage.setItem("User-Profile", JSON.stringify(data));
        window.location.reload();
      } else {
        console.error("Erro ao salvar:", response.statusText);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  return (
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
            <img src={mulher} alt="Foto do perfil" className="imagem-perfil" />
            <h2 className="nome-perfil">{profissionais.nome}</h2>
          </div>
          <div className="experiencia-perfil">
            <div style={{ width: "20rem" }}>
              <div style={{ position: "relative", width: "100%", minWidth: "200px" }}>
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
              <p>Agende sua consulta</p>
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
            <img src={voltar} alt="" className="voltar-seta" />
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
              value={profissionais.nome}
              required
              onChange={(e) =>
                setProfissionais((prev) => ({ ...prev, nome: e.target.value }))
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
            <label className={hasValueAbordagem ? "has-value" : ""}>Abordagem</label>
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
