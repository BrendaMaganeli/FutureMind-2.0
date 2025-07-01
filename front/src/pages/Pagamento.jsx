import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalContext";
import emailjs from "@emailjs/browser";

import voltar from "../assets/seta-principal.svg";
import "./CSS/Pagamento.css";

function Pagamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { date: initialDate = "", time: initialTime = "" } = location.state || {};
  const { 
    plano_selecionado,
    vim_plano,
    vim_agendamento,
    setVim_plano,
    setVim_agendamento
  } = useContext(GlobalContext);

  // URL parameters
  const searchParams = new URLSearchParams(location.search);
  const vimPlanoQuery = searchParams.get("vim_plano") === "true";
  const vimAgendamentoQuery = searchParams.get("vim_agendamento") === "true";

  // User data
  const user = JSON.parse(localStorage.getItem("User-Profile"));

  // Payment form states
  const [foto, setFoto] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(initialDate);
  const [horaSelecionada, setHoraSelecionada] = useState(initialTime);
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
  const [cupomInvalido, setCupomInvalido] = useState(false);
  const [metodoSelecionado, setMetodoSelecionado] = useState("cartao");
  const [consultas_disponiveis, setConsultas_disponiveis] = useState("");

  // Validation states
  const [valida_banco, setValida_banco] = useState(false);
  const [valida_numero_cartao, setValida_numero_cartao] = useState(false);
  const [valida_nome, setValida_nome] = useState(false);
  const [valida_cartao, setValida_cartao] = useState(false);
  const [valida_cvv, setValida_cvv] = useState(false);

  // Professional/plan info states
  const [profissionalNome, setProfissionalNome] = useState("");
  const [profissionalCRP, setProfissionalCRP] = useState("");
  const [valorConsulta, setValorConsulta] = useState(0);
  const [planoInfo, setPlanoInfo] = useState(null);

  // UI control states
  const [cadastrandoPlano, setCadastrandoPlano] = useState(() => {
    if (vimPlanoQuery) return true;
    if (vimAgendamentoQuery) return false;
    if (vim_plano) return true;
    if (vim_agendamento) return false;
    return localStorage.getItem("pagamentoOrigin") === "plano";
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAgenda, setMostrarAgenda] = useState(false);
  const [mostrarModalRemover, setMostrarModalRemover] = useState(false);
  const [dependentes, setDependentes] = useState([
    { value: "evelyn", label: "Evelyn Lohanny Santos Da Silva" }
  ]);
  const [nomeDependente, setNomeDependente] = useState("");
  const [nascimentoDependente, setNascimentoDependente] = useState("");

  // Formatting functions
  const formatarNumeroCartao = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const validarValidadeCartao = (validade) => {
    if (!validade || validade.length !== 5) return false;
    const [mesStr, anoStr] = validade.split("/");
    const mes = parseInt(mesStr, 10);
    const ano = parseInt(anoStr, 10);
    if (mes < 1 || mes > 12) return false;

    const agora = new Date();
    const anoAtual = agora.getFullYear() % 100;
    const mesAtual = agora.getMonth() + 1;

    return ano > anoAtual || (ano === anoAtual && mes >= mesAtual);
  };

  const formatarValidade = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    const numerosLimitados = somenteNumeros.slice(0, 4);
    return numerosLimitados.length <= 2 
      ? numerosLimitados 
      : `${numerosLimitados.substring(0, 2)}/${numerosLimitados.substring(2, 4)}`;
  };

  const aplicarCupom = () => {
    if (cupom.trim().toLowerCase() === "descontosocial") {
      setDesconto(valorConsulta * 0.5);
      setCupomInvalido(false);
    } else {
      setDesconto(0);
      if (cupom.trim() !== "") setCupomInvalido(true);
    }
  };

  const getFotoUrl = (foto) => {
  if (!foto || foto === 'icone_usuario.svg' || foto === 'iconusu.svg') {
    console.log(foto)
    return 'icone_usuario.svg';
  }
  if (foto.startsWith('http') || foto.startsWith('data')) {
    return foto;
  }
  return `http://localhost:4242${foto}`;
};

  useEffect(() => {
    const origin = cadastrandoPlano ? "plano" : "agendamento";
    localStorage.setItem("pagamentoOrigin", origin);
    setVim_plano(cadastrandoPlano);
    setVim_agendamento(!cadastrandoPlano);
  }, [cadastrandoPlano, setVim_plano, setVim_agendamento]);

  useEffect(() => {
    if (!id) {
      localStorage.removeItem("pagamentoOrigin");
      return;
    }

    if (cadastrandoPlano) {
      let valor = 0;
      let nomePlano = "";

      switch (plano_selecionado) {
        case "prata":
          valor = 189.99;
          nomePlano = "Plano Prata";
          break;
        case "ouro":
          valor = 459.99;
          nomePlano = "Plano Ouro";
          break;
        case "empresarial":
          valor = 200;
          nomePlano = "Plano Empresarial";
          break;
        default:
          valor = 189.99;
          nomePlano = "Plano Prata";
      }

      setValorConsulta(valor);
      setPlanoInfo({ nome: nomePlano, valor });
    } else {
      const getDadosProfissional = async () => {
        try {
          const response = await fetch(`http://localhost:4242/profissional/${id}`);
          if (!response.ok) return;

          const data = await response.json();
          setProfissionalNome(data.nome || "");
          setProfissionalCRP(data.crp || "");
          setValorConsulta(user?.chk_plano ? 0 : data.valor_consulta ?? 0);          
          setFoto(getFotoUrl(data?.foto));
          console.log(data.foto);
        } catch (err) {
          console.error("Erro ao buscar profissional:", err);
        }
      };
      getDadosProfissional();
    }
  }, [id, cadastrandoPlano, plano_selecionado]);

  // Validation effect handlers
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

  // Handlers
  const handleNumeroCartaoChange = (e) => {
    setNumeroCartao(formatarNumeroCartao(e.target.value));
    if (!toque_input_numero) setToque_input_numero(true);
  };

  const handleNomeCartao = (e) => {
    setNomeCartao(e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""));
  };

  const handleValidade = (e) => {
    const valorFormatado = formatarValidade(e.target.value);
    setValidadeCartao(valorFormatado);
    if (!toque_input_validade) setToque_input_validade(true);
    setValida_cartao(!validarValidadeCartao(valorFormatado));
  };

  const handleCvv = (e) => {
    setCvvCartao(e.target.value.replace(/\D/g, "").slice(0, 3));
    if (!toque_input_cvv) setToque_input_cvv(true);
  };

  const voltar_pagina = () => navigate(-1);

  const handleCadastrarDependente = () => {
    if (nomeDependente && nascimentoDependente && generoDependente) {
      const novoId = `dep-${Date.now()}`;
      setDependentes(prev => [...prev, { value: novoId, label: nomeDependente }]);
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

    emailjs.send(
      "service_5zq83hw",
      "template_bec35gi",
      templateParams,
      "ms7_9wi7dG_5vMUGt"
    ).then(() => {
      localStorage.removeItem("pagamentoOrigin");
      navigate("/inicio");
    }).catch(console.error);
  };

  const handleFinalizar = async () => {
    // Validation
    if (
      generoDependente.length <= 1 ||
      numeroCartao.length !== 19 ||
      nomeCartao.length === 0 ||
      !validarValidadeCartao(validadeCartao) ||
      cvvCartao.length !== 3
    ) {
      if (generoDependente.length <= 1) setValida_banco(true);
      if (numeroCartao.length !== 19) setValida_numero_cartao(true);
      if (nomeCartao.length === 0) setValida_nome(true);
      if (!validarValidadeCartao(validadeCartao)) setValida_cartao(true);
      if (cvvCartao.length !== 3) setValida_cvv(true);
      return;
    }

    try {
      if (cadastrandoPlano) {
        const hoje = new Date();
        const data_assinatura = hoje.toISOString().split("T")[0];
        const data_fim = new Date(hoje);
        data_fim.setMonth(data_fim.getMonth() + 1);

        const assinaturaBody = {
          data_assinatura,
          data_fim_assinatura: data_fim.toISOString().split("T")[0],
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
          console.error("Erro ao processar assinatura:", err.Error || assinaturaResp.statusText);
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
      } else {
        const agendamentoBody = {
          id_paciente: user.id_paciente,
          data: dataSelecionada,
          hora: horaSelecionada,
        };
        
        const agendamentoResp = await fetch(`http://localhost:4242/agendamento/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agendamentoBody),
        });

        if (!agendamentoResp.ok) {
          console.error("Falha ao registrar agendamento:", await agendamentoResp.text());
          return;
        }

        if (user.chk_plano) {
          try {
            const response = await fetch("http://localhost:4242/valor_consultas", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_paciente: user.id_paciente }),
            });

            if (!response.ok) throw new Error("Erro ao buscar consultas");

            const data = await response.json();
            setConsultas_disponiveis(data.consultas_disponiveis);

            if (data.consultas_disponiveis > 0) {
              const putResponse = await fetch("http://localhost:4242/mudar_valor_consultas", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_paciente: user.id_paciente,
                  chk_plano: false,
                }),
              });

              const putData = await putResponse.json();

              if (putResponse.ok) {
                setConsultas_disponiveis(prev => prev - 1);
              } else if (
                putResponse.status === 400 &&
                putData.error === "Última consulta, use a rota DELETE para remover a assinatura."
              ) {
                const deleteResponse = await fetch("http://localhost:4242/remover_assinatura", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id_paciente: user.id_paciente }),
                });

                if (deleteResponse.ok) {
                  const updateResponse = await fetch("http://localhost:4242/atualizar_chk_plano", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id_paciente: user.id_paciente,
                      chk_plano: false,
                    }),
                  });

                  if (updateResponse.ok) {
                    setUser({ ...user, chk_plano: false });
                    setConsultas_disponiveis(0);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Erro geral:", error);
          }
        }
      }

      sendEmail();
    } catch (err) {
      console.error("Erro inesperado em handleFinalizar:", err);
    }
  };

  return (
    <div className="container-principal" style={containerStyle}>
      {/* Left Column */}
      <div>
        <div className="header-com-seta">
          <button onClick={voltar_pagina} className="back-button-pt">
            <img src={voltar} alt="voltar" style={{ width: "3em" }} />
          </button>
          <h2>Finalize seu {cadastrandoPlano ? "plano" : "agendamento"}</h2>
        </div>

        {/* Payment Method Tabs */}
        <p style={sectionTitleStyle}>Forma de pagamento</p>
        <div className="tabs-container">
          <div className="slider" style={sliderStyle(metodoSelecionado)} />
          {paymentMethods.map(metodo => (
            <button
              key={metodo.value}
              onClick={() => setMetodoSelecionado(metodo.value)}
              className={`tab ${metodoSelecionado === metodo.value ? "active" : ""}`}
            >
              {metodo.label}
            </button>
          ))}
        </div>

        {/* Payment Form */}
        {metodoSelecionado === "cartao" && (
          <div style={paymentFormStyle}>
            <h3 style={sectionTitleStyle}>Informações do Pagamento</h3>

            <div className="floating-select-2">
              <select
                required
                value={generoDependente}
                onChange={(e) => setGeneroDependente(e.target.value)}
              >
                <option value="" disabled hidden>Selecione</option>
                <option value="c6_bank">C6 bank</option>
                <option value="inter">Inter</option>
                <option value="nubank">Nubank</option>
                <option value="itau">Itaú</option>
                <option value="bradesco">Bradesco</option>
              </select>
              <label>Banco</label>
            </div>
            <p className={`error-text ${valida_banco ? "show" : ""}`}>Selecione um banco.</p>

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
            <p className={`error-text ${valida_numero_cartao ? "show" : ""}`}>Número do cartão inválido.</p>

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
            <p className={`error-text ${valida_nome ? "show" : ""}`}>Nome obrigatório!</p>

            <div style={rowStyle}>
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
                  {validadeCartao.length !== 5 ? "Formato inválido (MM/AA)" : "Data de validade expirada ou inválida"}
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
                <p className={`error-text ${valida_cvv ? "show" : ""}`}>CVV inválido!</p>
              </div>
            </div>
          </div>
        )}

        {/* Other Payment Methods */}
        {(metodoSelecionado === "boleto" || metodoSelecionado === "pix") && (
          <div style={paymentFormStyle}>
            <h3 style={sectionTitleStyle}>Informações do Pagamento</h3>
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
            <div style={rowStyle}>
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

        {/* Coupon Section */}
        <p style={sectionTitleStyle}>Tem um cupom de desconto?</p>
        <div style={couponContainerStyle}>
          <div className="cupom">
            <input
              type="text"
              placeholder=" "
              value={cupom}
              onChange={(e) => {
                setCupom(e.target.value);
                setCupomInvalido(false);
              }}
              required
            />
            <label>Inserir código de desconto</label>
          </div>
          <button onClick={aplicarCupom} style={applyButtonStyle}>
            Aplicar
          </button>
        </div>
        {cupomInvalido && <p style={errorTextStyle}>Cupom inválido!</p>}

        {/* Who will be attended */}
        <div style={attendedContainerStyle}>
          <p style={{ fontWeight: "600" }}>Quem será atendido?</p>
          <button className="botaoNome" disabled>
            {user.nome || "Paciente"}
          </button>
        </div>

        {/* Finalize Button */}
        <button onClick={handleFinalizar} style={finalizeButtonStyle}>
          Finalizar {cadastrandoPlano ? "plano" : "agendamento"}
        </button>
      </div>

      {/* Right Column - Summary */}
      <div>
        <div style={summaryContainerStyle}>
          <p style={summaryTitleStyle}>Resumo</p>

          <div style={summaryRowStyle}>
            <span>
              {cadastrandoPlano
                ? planoInfo?.nome || "Assinatura do plano"
                : "Consulta psicológica"}
            </span>
            <span>
              {!cadastrandoPlano && user?.chk_plano ? (
                <span style={{ color: 'rgb(1, 58, 99)' }}>Inclusa no plano</span>
              ) : (
                `R$${valorConsulta.toFixed(2)}`
              )}
            </span>
          </div>

          {desconto > 0 && (
            <div style={summaryRowStyle}>
              <span style={{ color: "green" }}>Desconto aplicado</span>
              <span style={{ color: "green" }}>-R${desconto.toFixed(2)}</span>
            </div>
          )}

          <div style={dividerStyle}></div>
          <div style={totalAmountStyle}>
            <p style={{ fontSize: "14px", marginRight: "4%" }}>Valor a ser pago </p>
            <span style={{ fontSize: "22px" }}>
              {!cadastrandoPlano && user?.chk_plano ? (
                <span style={{ color: 'rgb(1, 58, 99)' }}>Grátis(plano)</span>
              ) : (
                `R$${(valorConsulta - desconto).toFixed(2)}`
              )}
            </span>
          </div>

          {/* Appointment Details */}
          {!cadastrandoPlano && profissionalNome && (
            <div style={appointmentDetailsStyle}>
              <p style={sectionTitleStyle}>Agendamentos</p>

              <div style={professionalInfoStyle}>
                <img
                  src={foto}
                  alt={`Foto de ${profissionalNome}`}
                  style={professionalImageStyle}
                />
                <div>
                  <p style={professionalNameStyle}>{profissionalNome}</p>
                  <p style={professionalCrpStyle}>
                    {profissionalCRP ? `CRP ${profissionalCRP}` : "--"}
                  </p>
                  <p style={{ fontSize: "16px" }}>Atendimento Online</p>
                </div>
              </div>

              {!cadastrandoPlano && user?.chk_plano && (
                <div style={planIncludedStyle}>
                  <p style={planIncludedTextStyle}>
                    Esta consulta está inclusa no seu plano. Não será cobrado valor adicional.
                  </p>
                </div>
              )}

              <div style={appointmentTimeStyle}>
                <div style={dateTimeStyle}>
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
                <div style={removeButtonContainerStyle}>
                  <button
                    onClick={() => setMostrarModalRemover(true)}
                    style={removeButtonStyle}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {mostrarModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>Cadastre um novo dependente!</h3>
              <button
                onClick={() => setMostrarModal(false)}
                style={closeButtonStyle}
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
                <option value="" disabled hidden>Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
              <label>Gênero</label>
            </div>
            <button
              onClick={handleCadastrarDependente}
              style={registerButtonStyle}
            >
              Cadastrar
            </button>
          </div>
        </div>
      )}

      {mostrarModalRemover && (
        <div style={modalOverlayStyle}>
          <div style={confirmationModalStyle}>
            <h3 style={confirmationTitleStyle}>
              Tem certeza que deseja remover este {cadastrandoPlano ? "plano" : "agendamento"}?
            </h3>
            <div style={confirmationButtonsStyle}>
              <button
                onClick={() => { window.location.href = "/"; }}
                style={confirmButtonStyle}
              >
                Sim
              </button>
              <button
                onClick={() => setMostrarModalRemover(false)}
                style={cancelButtonStyle}
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

// Styles
const containerStyle = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "40px",
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "24px"
};

const sectionTitleStyle = {
  fontWeight: "500",
  marginBottom: "8px"
};

const paymentFormStyle = {
  border: "1px solid #ddd",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "7px"
};

const rowStyle = {
  display: "flex",
  gap: "8px",
  marginTop: "8px"
};

const couponContainerStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "24px",
  width: "100%",
  alignItems: "center"
};

const applyButtonStyle = {
  backgroundColor: "#013a63",
  color: "white",
  padding: "8px 13px",
  border: "none",
  borderRadius: "6px",
  width: "20%",
  height: "45px",
  marginTop: "2.6%",
  cursor: "pointer"
};

const errorTextStyle = {
  color: "#d9534f",
  marginTop: "-16px",
  marginBottom: "16px",
  fontSize: "14px"
};

const attendedContainerStyle = {
  border: "1px solid #ddd",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "24px"
};

const finalizeButtonStyle = {
  width: "100%",
  marginTop: "24px",
  backgroundColor: "#013a63",
  color: "white",
  padding: "15px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600"
};

const summaryContainerStyle = {
  border: "1px solid #ddd",
  padding: "30px",
  borderRadius: "8px",
  width: "110%"
};

const summaryTitleStyle = {
  fontWeight: "700",
  marginTop: "5%",
  fontSize: "20px"
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
  marginTop: "5%"
};

const dividerStyle = {
  borderTop: "1.5px solid #ddd",
  margin: "8px 0"
};

const totalAmountStyle = {
  fontWeight: "500",
  textAlign: "right",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end"
};

const appointmentDetailsStyle = {
  marginTop: "24px"
};

const professionalInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "25px",
  marginTop: "12px"
};

const professionalImageStyle = {
  borderRadius: "9999px",
  width: "60px",
  height: "60px",
  objectFit: "cover"
};

const professionalNameStyle = {
  fontWeight: "500",
  fontSize: "16px"
};

const professionalCrpStyle = {
  fontSize: "16px",
  color: "#888"
};

const planIncludedStyle = {
  backgroundColor: '#e6f7ff',
  padding: '8px',
  borderRadius: '4px',
  marginTop: '8px',
  borderLeft: '3px solid #013a63'
};

const planIncludedTextStyle = {
  color: '#013a63',
  fontSize: '14px'
};

const appointmentTimeStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: '10%',
  borderTop: "1.5px solid #ddd",
};

const dateTimeStyle = {
  fontSize: "15px",
  display: "flex",
  marginTop: "5%",
  gap: "20px"
};

const removeButtonContainerStyle = {
  display: "flex",
  gap: "8px",
  marginTop: "5%"
};

const removeButtonStyle = {
  padding: "13px 29px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "rgb(1, 58, 99)",
  color: "white"
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "8px",
  width: "30%"
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const modalTitleStyle = {
  fontSize: "18px",
  fontWeight: "600"
};

const closeButtonStyle = {
  border: "none",
  background: "none",
  fontSize: "20px"
};

const registerButtonStyle = {
  width: "100%",
  marginTop: "16px",
  backgroundColor: "#013a63",
  color: "white",
  padding: "15px",
  border: "none",
  borderRadius: "4px",
  fontWeight: "600",
  fontSize: "1em"
};

const confirmationModalStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px"
};

const confirmationTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px"
};

const confirmationButtonsStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px"
};

const confirmButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#013a63",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontWeight: "600"
};

const cancelButtonStyle = {
  flex: 1,
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "white",
  fontWeight: "600"
};

const paymentMethods = [
  { value: "cartao", label: "Cartão de crédito" },
  { value: "boleto", label: "Boleto bancário" },
  { value: "pix", label: "Pix" }
];

const sliderStyle = (metodoSelecionado) => ({
  left: `${paymentMethods.findIndex(m => m.value === metodoSelecionado) * 33.333}%`
});

export default Pagamento;