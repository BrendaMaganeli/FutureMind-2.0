import { useState, useEffect, useContext, useCallback } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";

import "./CSS/Pagamento.css";
import mulherImg from "../assets/image 8.png";
import voltarIcon from "../assets/seta-principal.svg";

function Pagamento() {
  const navigate = useNavigate();
  const { id: profissionalId } = useParams(); 
  const { state } = useLocation();
  const { date: initialDate = "", time: initialTime = "" } = state || {};

  // ------------------------- Estados de Agendamento -------------------------
  const [dataSelecionada, setDataSelecionada] = useState(initialDate);
  const [horaSelecionada, setHoraSelecionada] = useState(initialTime);

  // ---------------------- Estados de Pagamento (Cartão) ---------------------
  const [bancoSelecionado, setBancoSelecionado] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  // -------------- Controle de Erros de Validação dos Campos ---------------
  const [erroBanco, setErroBanco] = useState(false);
  const [erroNumeroCartao, setErroNumeroCartao] = useState(false);
  const [erroNomeCartao, setErroNomeCartao] = useState(false);
  const [erroValidade, setErroValidade] = useState(false);
  const [erroCvv, setErroCvv] = useState(false);

  // ----------------------- Estados de Cupom e Desconto ----------------------
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);

  // -------------------- Dados do Usuário (Paciente) ------------------------
  const user = JSON.parse(localStorage.getItem("User-Profile")) || {};
  const { plano_selecionado, vim_plano } = useContext(GlobalContext);

  // --------------------- Dados do Profissional Agendado ---------------------
  const [profissionalNome, setProfissionalNome] = useState("");
  const [profissionalCrp, setProfissionalCrp] = useState("");
  const [valorConsulta, setValorConsulta] = useState(0);

  // --------------------- Estados de UI: Modais/Agenda -----------------------
  const [mostrarModalDependente, setMostrarModalDependente] = useState(false);
  const [mostrarModalRemover, setMostrarModalRemover] = useState(false);
  const [mostrandoAgenda, setMostrandoAgenda] = useState(false);

  // -------------------- Dados de Dependentes (Opcional) ---------------------
  const [dependentes, setDependentes] = useState([
    { value: "evelyn", label: "Evelyn Lohanny Santos Da Silva" },
  ]);
  const [novoDependenteNome, setNovoDependenteNome] = useState("");
  const [novoDependenteNascimento, setNovoDependenteNascimento] = useState("");
  const [novoDependenteGenero, setNovoDependenteGenero] = useState("");

  // ----------------------------- Aba de Pagamento ----------------------------
  const [metodoSelecionado, setMetodoSelecionado] = useState("cartao");

  // ------------------------- Formatação de Campos ---------------------------
  const formatarNumeroCartao = (valor) =>
    valor
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);

  const formatarValidadeCartao = (valor) => {
    const digitos = valor.replace(/\D/g, "");
    if (digitos.length <= 2) return digitos;
    return `${digitos.substring(0, 2)}/${digitos.substring(2, 4)}`;
  };

  // --------------------------- Handler de Cupom -----------------------------
  const aplicarCupom = useCallback(() => {
    if (cupom.trim().toLowerCase() === "desconto10") {
      setDesconto(valorConsulta * 0.1);
    } else {
      setDesconto(0);
    }
  }, [cupom, valorConsulta]);

  // ---------------------- Busca Dados do Profissional -----------------------
  useEffect(() => {
    async function fetchProfissional() {
      try {
        const response = await fetch(
          `http://localhost:4242/profissional/${profissionalId}`
        );
        if (!response.ok) {
          console.error("Falha ao buscar profissional:", response.statusText);
          return;
        }
        const { nome, crp, valor_consulta } = await response.json();
        setProfissionalNome(nome || "");
        setProfissionalCrp(crp || "");
        setValorConsulta(valor_consulta ?? 0);
      } catch (error) {
        console.error("Erro no fetch /profissional/:id →", error);
      }
    }
    fetchProfissional();
  }, [profissionalId]);

  // ------------ Limpa erros de validação conforme usuário digita ------------
  useEffect(() => {
    if (bancoSelecionado) setErroBanco(false);
  }, [bancoSelecionado]);

  useEffect(() => {
    if (numeroCartao) setErroNumeroCartao(false);
  }, [numeroCartao]);

  useEffect(() => {
    if (nomeCartao) setErroNomeCartao(false);
  }, [nomeCartao]);

  useEffect(() => {
    if (validadeCartao) setErroValidade(false);
  }, [validadeCartao]);

  useEffect(() => {
    if (cvvCartao) setErroCvv(false);
  }, [cvvCartao]);

  // ---------------------- Handlers de Campos de Cartão ----------------------
  const onNumeroCartaoChange = (e) => {
    setNumeroCartao(formatarNumeroCartao(e.target.value));
  };

  const onNomeCartaoChange = (e) => {
    const apenasLetras = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
    setNomeCartao(apenasLetras);
  };

  const onValidadeCartaoChange = (e) => {
    setValidadeCartao(formatarValidadeCartao(e.target.value));
  };

  const onCvvChange = (e) => {
    setCvvCartao(e.target.value);
  };

  // ----------------------- Voltar para Tela Anterior ------------------------
  const voltarPagina = () => navigate(-1);

  // ----------------------- Cadastrar Novo Dependente ------------------------
  const cadastrarDependente = () => {
    if (
      novoDependenteNome &&
      novoDependenteNascimento &&
      novoDependenteGenero
    ) {
      const novoId = `dep-${Date.now()}`;
      setDependentes([
        ...dependentes,
        { value: novoId, label: novoDependenteNome },
      ]);
      setMostrarModalDependente(false);
      setNovoDependenteNome("");
      setNovoDependenteNascimento("");
      setNovoDependenteGenero("");
    }
  };

  // ------------------- Enviar E-mail ao Finalizar Agendamento ------------------
  const enviarEmailConfirmacao = () => {
    const templateParams = {
      email: user.email || "não informado",
      paciente: user.nome || "Não informado",
      banco: bancoSelecionado || "Não informado",
      numero_cartao: numeroCartao || "Não informado",
      nome_cartao: nomeCartao || "Não informado",
      validade_cartao: validadeCartao || "Não informado",
      cvv_cartao: cvvCartao || "Não informado",
      cupom_aplicado: cupom || "Nenhum",
      valor_total: (valorConsulta - desconto).toFixed(2),
      destinatario: "Brenda",
      logo: "logo oficial.svg",
    };

    emailjs
      .send(
        "service_5zq83hw",
        "template_bec35gi",
        templateParams,
        "ms7_9wi7dG_5vMUGt"
      )
      .then(() => navigate("/inicio"))
      .catch((erro) => console.error("Erro ao enviar e-mail:", erro));
  };

  // ------------------ Finalizar Agendamento + Gravar Assinatura ------------------
  const finalizarAgendamento = async () => {
    // Validação de todos os campos obrigatórios do cartão
    const hasError =
      !bancoSelecionado ||
      numeroCartao.length !== 19 ||
      !nomeCartao ||
      validadeCartao.length !== 5 ||
      cvvCartao.length !== 3;

    if (hasError) {
      setErroBanco(!bancoSelecionado);
      setErroNumeroCartao(numeroCartao.length !== 19);
      setErroNomeCartao(!nomeCartao);
      setErroValidade(validadeCartao.length !== 5);
      setErroCvv(cvvCartao.length !== 3);
      return;
    }

    try {
      // Se usuário não tiver plano e veio da tela de planos
      if (!user.chk_plano && vim_plano) {
        const hoje = new Date();
        const dataAssinatura = hoje.toISOString().split("T")[0];
        const dataFim = new Date(hoje);
        dataFim.setMonth(dataFim.getMonth() + 1);
        const dataFimAssinatura = dataFim.toISOString().split("T")[0];

        const assinaturaBody = {
          data_assinatura: dataAssinatura,
          data_fim_assinatura: dataFimAssinatura,
          fk_id_paciente: user.id_paciente,
          tipo_assinatura: plano_selecionado,
        };

        const assinaturaResp = await fetch(
          "http://localhost:4242/assinatura",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assinaturaBody),
          }
        );
        if (!assinaturaResp.ok) {
          const err = await assinaturaResp.json();
          alert(
            "Erro ao processar assinatura: " +
              (err.Error || assinaturaResp.statusText)
          );
          return;
        }

        user.chk_plano = true;
        localStorage.setItem("User-Profile", JSON.stringify(user));
        await fetch("http://localhost:4242/pagamento", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_paciente: user.id_paciente,
            chk_plano: true,
          }),
        });
      }

      // Cria o agendamento do paciente para este profissional
      const agendamentoBody = {
        id_paciente: user.id_paciente,
        data: dataSelecionada,
        hora: horaSelecionada,
      };

      const agendamentoResp = await fetch(
        `http://localhost:4242/agendamento/${profissionalId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agendamentoBody),
        }
      );
      if (!agendamentoResp.ok) {
        console.error(
          "Falha ao registrar agendamento:",
          await agendamentoResp.text()
        );
        return;
      }

      enviarEmailConfirmacao();
    } catch (error) {
      console.error("Erro inesperado em finalizarAgendamento:", error);
    }
  };

  // ---------------------- Renderização das Abas de Pagamento ----------------------
  const renderTabsPagamento = () => (
    <div className="tabs-container">
      <div
        className="slider"
        style={{
          left: `${["cartao", "boleto", "pix"].indexOf(metodoSelecionado) *
            33.333}%`,
        }}
      />
      {[
        { value: "cartao", label: "Cartão de crédito" },
        { value: "boleto", label: "Boleto bancário" },
        { value: "pix", label: "Pix" },
      ].map((opcao) => (
        <button
          key={opcao.value}
          onClick={() => setMetodoSelecionado(opcao.value)}
          className={`tab ${
            metodoSelecionado === opcao.value ? "active" : ""
          }`}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  );

  // -------------------- Renderização dos Campos de Cartão ---------------------
  const renderCamposCartao = () => (
    <>
      <div className="floating-select-2">
        <select
          required
          value={bancoSelecionado}
          onChange={(e) => setBancoSelecionado(e.target.value)}
        >
          <option value="" disabled hidden>
            Selecione
          </option>
          <option value="c6_bank">C6 Bank</option>
          <option value="inter">Inter</option>
          <option value="nubank">Nubank</option>
          <option value="itau">Itaú</option>
          <option value="bradesco">Bradesco</option>
        </select>
        <label>Banco</label>
      </div>
      {erroBanco && <p className="error-text show">Selecione um banco.</p>}

      <div className="floating-input">
        <input
          type="text"
          placeholder=" "
          value={numeroCartao}
          onChange={onNumeroCartaoChange}
          required
        />
        <label>Número do Cartão</label>
      </div>
      {erroNumeroCartao && (
        <p className="error-text show">Número do cartão inválido.</p>
      )}

      <div className="floating-input">
        <input
          type="text"
          placeholder=" "
          value={nomeCartao}
          onChange={onNomeCartaoChange}
          required
        />
        <label>Nome como aparece no cartão</label>
      </div>
      {erroNomeCartao && <p className="error-text show">Nome obrigatório!</p>}

      <div className="row-inputs">
        <div className="col-input">
          <div className="floating-input-2">
            <input
              type="text"
              placeholder=" "
              value={validadeCartao}
              onChange={onValidadeCartaoChange}
              required
            />
            <label>Validade</label>
          </div>
          {erroValidade && (
            <p className="error-text show">Validade incorreta</p>
          )}
        </div>
        <div className="col-input">
          <div className="floating-input-2">
            <input
              maxLength={3}
              type="text"
              placeholder=" "
              value={cvvCartao}
              onChange={onCvvChange}
              required
            />
            <label>CVV</label>
          </div>
          {erroCvv && <p className="error-text show">CVV inválido!</p>}
        </div>
      </div>
    </>
  );

  // --------------- Renderização dos Campos de Boleto / Pix (Exemplo) ---------------
  const renderCamposBoletoPix = () => (
    <>
      <div className="floating-input">
        <input type="text" placeholder=" " required />
        <label>CPF</label>
      </div>
      <div className="floating-input">
        <input type="text" placeholder=" " required />
        <label>Endereço</label>
      </div>
      <div className="floating-input">
        <input type="text" placeholder=" " required />
        <label>Nome Completo</label>
      </div>
      <div className="row-inputs">
        <div className="col-input">
          <div className="floating-input-2">
            <input type="text" placeholder=" " required />
            <label>Estado</label>
          </div>
        </div>
        <div className="col-input">
          <div className="floating-input-2">
            <input type="text" placeholder=" " required />
            <label>Cidade</label>
          </div>
        </div>
      </div>
    </>
  );

  // --------------------------- Renderização do Formulário ---------------------------
  const renderFormularioPagamento = () => (
    <div className="payment-section">
      <p className="section-title">Forma de pagamento</p>
      {renderTabsPagamento()}

      {metodoSelecionado === "cartao" && (
        <div className="payment-card-section">
          <h3 className="subsection-title">Informações do Pagamento</h3>
          {renderCamposCartao()}
        </div>
      )}

      {(metodoSelecionado === "boleto" || metodoSelecionado === "pix") && (
        <div className="payment-card-section">
          <h3 className="subsection-title">Informações do Pagamento</h3>
          {renderCamposBoletoPix()}
        </div>
      )}

      <p className="section-title">Tem um cupom de desconto?</p>
      <div className="cupom-container">
        <div className="floating-input cupom-input">
          <input
            type="text"
            placeholder=" "
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            required
          />
          <label>Inserir código de desconto</label>
        </div>
        <button className="btn-aplicar-cupom" onClick={aplicarCupom}>
          Aplicar
        </button>
      </div>

      <div className="patient-section">
        <p className="subsection-title">Quem será atendido?</p>
        <button className="btn-paciente" disabled>
          {user.nome || "Paciente"}
        </button>
      </div>

      <button className="btn-finalizar" onClick={finalizarAgendamento}>
        Finalizar agendamento
      </button>
    </div>
  );

  // ------------------------- Renderização do Resumo e Profissional -------------------------
  const renderResumoEProfissional = () => (
    <div className="summary-section">
      <p className="summary-title">Resumo</p>

      <div className="summary-row">
        <span>Consultas</span>
        <span>R${valorConsulta.toFixed(2)}</span>
      </div>
      {desconto > 0 && (
        <div className="summary-row discount-row">
          <span>Desconto aplicado</span>
          <span>-R${desconto.toFixed(2)}</span>
        </div>
      )}
      <div className="summary-divider" />
      <div className="summary-total">
        <p className="summary-label">Valor a ser pago</p>
        <span className="summary-value">
          R${(valorConsulta - desconto).toFixed(2)}
        </span>
      </div>

      <div className="professional-section">
        <p className="subsection-title">Agendamentos</p>
        <div className="professional-info">
          <img
            src={mulherImg}
            alt={`Foto de ${profissionalNome}`}
            className="professional-img"
          />
          <div className="professional-texts">
            <p className="professional-name">
              {profissionalNome || "Carregando..."}
            </p>
            <p className="professional-crp">
              {profissionalCrp ? `CRP ${profissionalCrp}` : "--"}
            </p>
            <p className="professional-type">Atendimento Online</p>
          </div>
        </div>

        <div className="appointment-row">
          <div className="appointment-info">
            <p>
              <strong>Data:</strong>{" "}
              {dataSelecionada
                ? dataSelecionada.split("-").reverse().join("/")
                : "--/--/----"}
            </p>
            <p>
              <strong>Horário:</strong> {horaSelecionada || "--:--"}
            </p>
          </div>
          <div className="appointment-buttons">
            <button
              className="btn-alterar"
              onClick={() => setMostrandoAgenda(true)}
            >
              Alterar
            </button>
            <button
              className="btn-remover"
              onClick={() => setMostrarModalRemover(true)}
            >
              Remover
            </button>
          </div>
        </div>

        {mostrandoAgenda && (
          <div className="agenda-section">
            <div className="floating-input-4">
              <input
                type="date"
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
                required
              />
              <label>Nova data</label>
            </div>
            <div className="floating-input-4">
              <input
                type="time"
                value={horaSelecionada}
                onChange={(e) => setHoraSelecionada(e.target.value)}
                required
              />
              <label>Novo horário</label>
            </div>
            <button
              className="btn-confirmar-alteracao"
              onClick={() => setMostrandoAgenda(false)}
            >
              Confirmar alteração
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-principal">
      {/* Coluna Esquerda: Formulário de Pagamento */}
      <div className="coluna-esquerda">
        <header className="header-com-seta">
          <button onClick={voltarPagina} className="back-button">
            <img src={voltarIcon} alt="Voltar" className="icon-voltar" />
          </button>
          <h2>Finalize seu agendamento</h2>
        </header>
        {renderFormularioPagamento()}
      </div>

      {/* Coluna Direita: Resumo e Dados do Profissional */}
      <div className="coluna-direita">{renderResumoEProfissional()}</div>

      {/* Modal de Cadastrar Dependente */}
      {mostrarModalDependente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cadastre um novo dependente!</h3>
              <button
                onClick={() => setMostrarModalDependente(false)}
                className="btn-close-modal"
              >
                ×
              </button>
            </div>
            <div className="floating-input-3">
              <input
                type="text"
                placeholder=" "
                value={novoDependenteNome}
                onChange={(e) => setNovoDependenteNome(e.target.value)}
                required
              />
              <label>Nome Completo</label>
            </div>
            <div className="floating-input-3">
              <input
                type="date"
                placeholder=" "
                value={novoDependenteNascimento}
                onChange={(e) => setNovoDependenteNascimento(e.target.value)}
                required
              />
              <label>Data de Nascimento</label>
            </div>
            <div className="floating-select">
              <select
                required
                value={novoDependenteGenero}
                onChange={(e) => setNovoDependenteGenero(e.target.value)}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
              <label>Gênero</label>
            </div>
            <button
              className="btn-cadastrar-dependente"
              onClick={cadastrarDependente}
            >
              Cadastrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Remoção de Agendamento */}
      {mostrarModalRemover && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <h3>Tem certeza que deseja remover este agendamento?</h3>
            <div className="modal-buttons">
              <button
                className="btn-sim-remover"
                onClick={() => (window.location.href = "/")}
              >
                Sim
              </button>
              <button
                className="btn-nao-remover"
                onClick={() => setMostrarModalRemover(false)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagamento;
