import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import "./CSS/Pagamento.css";
import mulher from "../assets/image 8.png";
import voltar from "../assets/seta-principal.svg";
import emailjs from "@emailjs/browser";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function Pagamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { date: initialDate = "", time: initialTime = "" } = location.state || {};
  
  // Verificação da origem via URL
  const searchParams = new URLSearchParams(location.search);
  const vimPlanoQuery = searchParams.get('vim_plano') === 'true';
  const vimAgendamentoQuery = searchParams.get('vim_agendamento') === 'true';

  // Estados de agendamento e formulário de pagamento
  const [dataSelecionada, setDataSelecionada] = useState(initialDate);
  const [horaSelecionada, setHoraSelecionada] = useState(initialTime);

  // Estados do formulário de pagamento
  const [toque_input_numero, setToque_input_numero] = useState(false);
  const [toque_input_validade, setToque_input_validade] = useState(false);
  const [toque_input_cvv, setToque_input_cvv] = useState(false);

  const [generoDependente, setGeneroDependente] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);

  // Validações visuais
  const [valida_banco, setValida_banco] = useState(false);
  const [valida_numero_cartao, setValida_numero_cartao] = useState(false);
  const [valida_nome, setValida_nome] = useState(false);
  const [valida_cartao, setValida_cartao] = useState(false);
  const [valida_cvv, setValida_cvv] = useState(false);

  const [metodoSelecionado, setMetodoSelecionado] = useState("cartao");

  const { plano_selecionado, vim_plano, vim_agendamento, setVim_plano, setVim_agendamento } = useContext(GlobalContext);

  const user = JSON.parse(localStorage.getItem("User-Profile"));


  const [profissionalNome, setProfissionalNome] = useState("");
  const [profissionalCRP, setProfissionalCRP] = useState("");
  const [valorConsulta, setValorConsulta] = useState(0);
  const [planoInfo, setPlanoInfo] = useState(null);


  const [cadastrandoPlano, setCadastrandoPlano] = useState(() => {
    if (vimPlanoQuery) return true;
    if (vimAgendamentoQuery) return false;
    

    if (vim_plano) return true;
    if (vim_agendamento) return false;
    

    const savedOrigin = localStorage.getItem('pagamentoOrigin');
    return savedOrigin === 'plano';
  });

  // Persistir origem no localStorage
  useEffect(() => {
    const origin = cadastrandoPlano ? 'plano' : 'agendamento';
    localStorage.setItem('pagamentoOrigin', origin);
    
    // Atualizar contexto global
    setVim_plano(cadastrandoPlano);
    setVim_agendamento(!cadastrandoPlano);
  }, [cadastrandoPlano, setVim_plano, setVim_agendamento]);

  // Modais e dependentes
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAgenda, setMostrarAgenda] = useState(false);
  const [mostrarModalRemover, setMostrarModalRemover] = useState(false);
  const [dependentes, setDependentes] = useState([
    { value: "evelyn", label: "Evelyn Lohanny Santos Da Silva" },
  ]);
  const [nomeDependente, setNomeDependente] = useState("");
  const [nascimentoDependente, setNascimentoDependente] = useState("");

  // Funções de formatação
  const formatarNumeroCartao = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatarValidade = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    if (somenteNumeros.length <= 2) {
      return somenteNumeros;
    }
    return (
      somenteNumeros.substring(0, 2) + "/" + somenteNumeros.substring(2, 4)
    );
  };

  const aplicarCupom = () => {
    if (cupom.trim().toLowerCase() === "desconto10") {
      setDesconto(valorConsulta * 0.1);
    } else {
      setDesconto(0);
    }
  };

  // Buscar dados do profissional ou plano
  useEffect(() => {
    // Limpar origem se navegação direta sem ID
    if (!id) {
      localStorage.removeItem('pagamentoOrigin');
      return;
    }

    if (cadastrandoPlano) {
      let valor = 0;
      let nomePlano = "";

      switch (plano_selecionado) {
        case "basico":
          valor = 189.99;
          nomePlano = "Plano Prata";
          break;
        case "intermediario":
          valor = 150;
          nomePlano = "Plano Ouro";
          break;
        case "premium":
          valor = 200;
          nomePlano = "Plano Empresarial";
          break;
        default:
          valor = 100;
          nomePlano = "Plano Prata";
      }

      setValorConsulta(valor);
      setPlanoInfo({
        nome: nomePlano,
        valor: valor,
      });
    } else {
      const getDadosProfissional = async () => {
        try {
          const response = await fetch(
            `http://localhost:4242/profissional/${id}`
          );
          if (!response.ok) {
            console.error("Falha ao buscar profissional:", response.statusText);
            return;
          }
          const data = await response.json();

          setProfissionalNome(data.nome || "");
          setProfissionalCRP(data.crp || "");
          setValorConsulta(data.valor_consulta != null ? data.valor_consulta : 0);
        } catch (err) {
          console.error("Erro no fetch /profissional/:id →", err);
        }
      };

      getDadosProfissional();
    }
  }, [id, cadastrandoPlano, plano_selecionado]);

  // Efeitos para validação
  useEffect(() => {
    if (generoDependente.length > 0) setValida_banco(false);
  }, [generoDependente]);

  useEffect(() => {
    if (numeroCartao.length > 0) setValida_numero_cartao(false);
  }, [numeroCartao]);

  useEffect(() => {
    if (nomeCartao.length > 0) setValida_nome(false);
  }, [nomeCartao]);

  useEffect(() => {
    if (validadeCartao.length > 0) setValida_cartao(false);
  }, [validadeCartao]);

  useEffect(() => {
    if (cvvCartao.length > 0) setValida_cvv(false);
  }, [cvvCartao]);

  // Handlers dos campos
  const handleNumeroCartaoChange = (e) => {
    setNumeroCartao(formatarNumeroCartao(e.target.value));
    if (!toque_input_numero) setToque_input_numero(true);
  };

  const handleNomeCartao = (e) => {
    const apenasLetras = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
    setNomeCartao(apenasLetras);
  };

  const handleValidade = (e) => {
    setValidadeCartao(formatarValidade(e.target.value));
    if (!toque_input_validade) setToque_input_validade(true);
  };

  const handleCvv = (e) => {
    setCvvCartao(e.target.value);
    if (!toque_input_cvv) setToque_input_cvv(true);
  };

  const voltar_pagina = () => {
    navigate(-1);
  };

  const handleCadastrarDependente = () => {
    if (nomeDependente && nascimentoDependente && generoDependente) {
      const novoId = `dep-${Date.now()}`;
      const novoDependente = {
        value: novoId,
        label: nomeDependente,
      };
      setDependentes((prev) => [...prev, novoDependente]);
      setMostrarModal(false);
      setNomeDependente("");
      setNascimentoDependente("");
      setGeneroDependente("");
    }
  };

  const sendEmail = () => {
    const templateParams = {
      email: user.email || "não informado",
      paciente: user.nome || "Não informado",
      banco: generoDependente || "Não informado",
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
      .then(() => {
        localStorage.removeItem('pagamentoOrigin'); // Limpar ao finalizar
        navigate("/inicio");
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail:", error);
      });
  };

  const handleFinalizar = async () => {
    // Validações
    if (
      generoDependente.length <= 1 ||
      numeroCartao.length !== 19 ||
      nomeCartao.length === 0 ||
      validadeCartao.length !== 5 ||
      cvvCartao.length !== 3
    ) {
      if (generoDependente.length <= 1) setValida_banco(true);
      if (numeroCartao.length !== 19) setValida_numero_cartao(true);
      if (nomeCartao.length === 0) setValida_nome(true);
      if (validadeCartao.length !== 5) setValida_cartao(true);
      if (cvvCartao.length !== 3) setValida_cvv(true);
      return;
    }

    try {
      // Lógica para planos
      if (cadastrandoPlano) {
        const hoje = new Date();
        const data_assinatura = hoje.toISOString().split("T")[0];
        const data_fim = new Date(hoje);
        data_fim.setMonth(data_fim.getMonth() + 1);
        const data_fim_assinatura = data_fim.toISOString().split("T")[0];

        const assinaturaBody = {
          data_assinatura,
          data_fim_assinatura,
          fk_id_paciente: user.id_paciente,
          tipo_assinatura: plano_selecionado,
        };

        const assinaturaResp = await fetch("http://localhost:4242/assinatura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(assinaturaBody),
        });

        if (!assinaturaResp.ok) {
          const err = await assinaturaResp.json();
          alert(
            "Erro ao processar assinatura: " +
              (err.Error || assinaturaResp.statusText)
          );
          return;
        }

        // Atualizar usuário localmente e no servidor
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
      } else {
        // Lógica para agendamento
        const agendamentoBody = {
          id_paciente: user.id_paciente,
          data: dataSelecionada,
          hora: horaSelecionada,
        };
        const agendamentoResp = await fetch(
          `http://localhost:4242/agendamento/${id}`,
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
      }

      sendEmail();
    } catch (err) {
      console.error("Erro inesperado em handleFinalizar:", err);
    }
  };

  return (
    <div
      className="container-principal"
      style={{
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "40px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
      }}
    >
      {/* ========================== COLUNA ESQUERDA ========================== */}
      <div>
        <div className="header-com-seta">
          <button onClick={voltar_pagina} className="back-button-pt">
            <img src={voltar} alt="voltar" style={{ width: "3em" }} />
          </button>
          <h2>Finalize seu {cadastrandoPlano ? "plano" : "agendamento"}</h2>
        </div>

        {/* ------------ Forma de pagamento (abas Cartão / Boleto / Pix) ------------ */}
        <p style={{ fontWeight: "500", marginBottom: "8px" }}>
          Forma de pagamento
        </p>
        <div className="tabs-container">
          <div
            className="slider"
            style={{
              left: `${["cartao", "boleto", "pix"].indexOf(metodoSelecionado) * 33.333}%`,
            }}
          />
          {[
            { value: "cartao", label: "Cartão de crédito" },
            { value: "boleto", label: "Boleto bancário" },
            { value: "pix", label: "Pix" },
          ].map((metodo) => (
            <button
              key={metodo.value}
              onClick={() => setMetodoSelecionado(metodo.value)}
              className={`tab ${metodoSelecionado === metodo.value ? "active" : ""}`}
            >
              {metodo.label}
            </button>
          ))}
        </div>

        {metodoSelecionado === "cartao" && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "7px",
            }}
          >
            <h3 style={{ fontWeight: "500" }}>Informações do Pagamento</h3>

            {/* Banco */}
            <div className="floating-select-2">
              <select
                required
                value={generoDependente}
                onChange={(e) => setGeneroDependente(e.target.value)}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>
                <option value="c6_bank">C6 bank</option>
                <option value="inter">Inter</option>
                <option value="nubank">Nubank</option>
                <option value="itau">Itaú</option>
                <option value="bradesco">Bradesco</option>
              </select>
              <label>Banco</label>
            </div>
            <p className={`error-text ${valida_banco ? "show" : ""}`}>
              Selecione um banco.
            </p>

            {/* Número do cartão */}
            <div className="floating-input">
              <input
                type="text"
                placeholder=" "
                value={numeroCartao}
                onChange={handleNumeroCartaoChange}
                required
              />
              <label>Número do Cartão</label>
            </div>
            <p className={`error-text ${valida_numero_cartao ? "show" : ""}`}>
              Número do cartão inválido.
            </p>

            {/* Nome no cartão */}
            <div className="floating-input">
              <input
                type="text"
                placeholder=" "
                value={nomeCartao}
                onChange={handleNomeCartao}
                required
              />
              <label>Nome como aparece no cartão</label>
            </div>
            <p className={`error-text ${valida_nome ? "show" : ""}`}>
              Nome obrigatório!
            </p>

            {/* Validade e CVV */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <div style={{ flex: 1 }}>
                <div className="floating-input-2">
                  <input
                    type="text"
                    placeholder=" "
                    value={validadeCartao}
                    onChange={handleValidade}
                    required
                  />
                  <label>Validade</label>
                </div>
                <p className={`error-text ${valida_cartao ? "show" : ""}`}>
                  Validade incorreta
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <div className="floating-input-2">
                  <input
                    maxLength={3}
                    type="text"
                    placeholder=" "
                    value={cvvCartao}
                    onChange={handleCvv}
                    required
                  />
                  <label>CVV</label>
                </div>
                <p className={`error-text ${valida_cvv ? "show" : ""}`}>
                  CVV inválido!
                </p>
              </div>
            </div>
          </div>
        )}

        {(metodoSelecionado === "boleto" || metodoSelecionado === "pix") && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontWeight: "500" }}>Informações do Pagamento</h3>
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
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <div className="floating-input-2">
                <input type="text" placeholder=" " required />
                <label>Estado</label>
              </div>
              <div className="floating-input-2">
                <input type="text" placeholder=" " required />
                <label>Cidade</label>
              </div>
            </div>
          </div>
        )}

        {/* ------------ Cupom ------------ */}
        <p style={{ fontWeight: "500" }}>Tem um cupom de desconto?</p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div className="cupom">
            <input
              type="text"
              placeholder=" "
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
              required
            />
            <label>Inserir código de desconto</label>
          </div>
          <button
            onClick={aplicarCupom}
            style={{
              backgroundColor: "#013a63",
              color: "white",
              padding: "8px 13px",
              border: "none",
              borderRadius: "6px",
              width: "20%",
              height: "45px",
              marginTop: "2.6%",
              cursor: "pointer",
            }}
          >
            Aplicar
          </button>
        </div>

        {/* ------------ Quem será atendido? ------------ */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontWeight: "600" }}>Quem será atendido?</p>
          <button className="botaoNome" disabled>
            {user.nome || "Paciente"}
          </button>
        </div>

        {/* Botão finalizar */}
        <button
          onClick={handleFinalizar}
          style={{
            width: "100%",
            marginTop: "24px",
            backgroundColor: "#013a63",
            color: "white",
            padding: "15px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          Finalizar {cadastrandoPlano ? "plano" : "agendamento"}
        </button>
      </div>

      {/* ========================== COLUNA DIREITA ========================== */}
      <div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "30px",
            borderRadius: "8px",
            width: "110%",
          }}
        >
          <p style={{ fontWeight: "700", marginTop: "5%", fontSize: "20px" }}>
            Resumo
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              marginTop: "5%",
            }}
          >
            <span>
              {cadastrandoPlano
                ? planoInfo?.nome || "Assinatura do plano"
                : "Consultas"}
            </span>
            <span>R${valorConsulta.toFixed(2)}</span>
          </div>

          {desconto > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "green" }}>Desconto aplicado</span>
              <span style={{ color: "green" }}>-R${desconto.toFixed(2)}</span>
            </div>
          )}

          <div style={{ borderTop: "1.5px solid #ddd", margin: "8px 0" }}></div>
          <div
            style={{
              fontWeight: "500",
              textAlign: "right",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <p style={{ fontSize: "14px", marginRight: "4%" }}>
              Valor a ser pago{" "}
            </p>
            <span style={{ fontSize: "22px" }}>
              R${(valorConsulta - desconto).toFixed(2)}
            </span>
          </div>

          {/* Renderização condicional para agendamentos ou plano */}
          {!cadastrandoPlano && profissionalNome && (
            <div style={{ marginTop: "24px" }}>
              <p
                style={{
                  fontWeight: "500",
                  marginTop: "16px",
                  fontSize: "20px",
                }}
              >
                Agendamentos
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "25px",
                  marginTop: "12px",
                }}
              >
                <img
                  src={mulher}
                  alt={`Foto de ${profissionalNome}`}
                  style={{
                    borderRadius: "9999px",
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ fontWeight: "500", fontSize: "16px" }}>
                    {profissionalNome}
                  </p>
                  <p style={{ fontSize: "16px", color: "#888" }}>
                    {profissionalCRP ? `CRP ${profissionalCRP}` : "--"}
                  </p>
                  <p style={{ fontSize: "16px" }}>Atendimento Online</p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10%",
                  borderTop: "1.5px solid #ddd",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    display: "flex",
                    marginTop: "5%",
                    gap: "16px",
                  }}
                >
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
                <div style={{ display: "flex", gap: "8px", marginTop: "5%" }}>
                  <button
                    onClick={() => setMostrarAgenda(true)}
                    style={{
                      backgroundColor: "#013a63",
                      color: "white",
                      padding: "12px 20px",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  >
                    Alterar
                  </button>
                  <button
                    onClick={() => setMostrarModalRemover(true)}
                    style={{
                      padding: "8px 16px",
                      border: "2px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "transparent",
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          )}

          {mostrarAgenda && !cadastrandoPlano && (
            <div style={{ marginTop: "16px" }}>
              <div className="floating-input-4">
                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  required
                />
                <label>Nova data</label>
              </div>
              <div className="floating-input-4" style={{ marginTop: "8px" }}>
                <input
                  type="time"
                  value={horaSelecionada}
                  onChange={(e) => setHoraSelecionada(e.target.value)}
                  required
                />
                <label>Novo horário</label>
              </div>
              <button
                onClick={() => setMostrarAgenda(false)}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  backgroundColor: "#013a63",
                  color: "white",
                  padding: "12px",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "600",
                }}
              >
                Confirmar alteração
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "30%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                Cadastre um novo dependente!
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                style={{ border: "none", background: "none", fontSize: "20px" }}
              >
                ×
              </button>
            </div>
            <div className="floating-input-3">
              <input
                type="text"
                placeholder=" "
                required
                value={nomeDependente}
                onChange={(e) => setNomeDependente(e.target.value)}
              />
              <label>Nome Completo</label>
            </div>
            <div className="floating-input-3">
              <input
                type="date"
                placeholder=" "
                required
                value={nascimentoDependente}
                onChange={(e) => setNascimentoDependente(e.target.value)}
              />
              <label>Data de Nascimento</label>
            </div>
            <div className="floating-select">
              <select
                required
                value={generoDependente}
                onChange={(e) => setGeneroDependente(e.target.value)}
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
              onClick={handleCadastrarDependente}
              style={{
                width: "100%",
                marginTop: "16px",
                backgroundColor: "#013a63",
                color: "white",
                padding: "15px",
                border: "none",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "1em",
              }}
            >
              Cadastrar
            </button>
          </div>
        </div>
      )}

      {mostrarModalRemover && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Tem certeza que deseja remover este{" "}
              {cadastrandoPlano ? "plano" : "agendamento"}?
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#013a63",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "600",
                }}
              >
                Sim
              </button>
              <button
                onClick={() => setMostrarModalRemover(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  fontWeight: "600",
                }}
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