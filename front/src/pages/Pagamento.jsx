import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { GlobalContext } from "../Context/GlobalContext";
import "./CSS/Pagamento.css";
import voltar from "../assets/seta-principal.svg";
import mulher from "../assets/image 8.png";
import Seta from "../assets/caret-down-solid.svg";

function Pagamento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { date: dateFromNav, time: timeFromNav } = state || {};
  const [dataSelecionada, setDataSelecionada] = useState(dateFromNav || "");
  const [horaSelecionada, setHoraSelecionada] = useState(timeFromNav || "");
  const [generoDependente, setGeneroDependente] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const valorOriginal = 165;

  const [mostrarAgenda, setMostrarAgenda] = useState(false);
  const [mostrarModalRemover, setMostrarModalRemover] = useState(false);
  const [nomeDependente, setNomeDependente] = useState("");
  const [nascimentoDependente, setNascimentoDependente] = useState("");
  const [valida_banco, setValida_banco] = useState(false);
  const [valida_numero_cartao, setValida_numero_cartao] = useState(false);
  const [valida_nome, setValida_nome] = useState(false);
  const [valida_cartao, setValida_cartao] = useState(false);
  const [valida_cvv, setValida_cvv] = useState(false);

  const { plano_selecionado, vim_plano } = useContext(GlobalContext);
  const { id } = useParams(); // id do profissional
  const user = JSON.parse(localStorage.getItem("User-Profile"));

  const [consultas_disponiveis, setConsultas_disponiveis] = useState(0);

  // Busca quantas consultas disponíveis o paciente já tem (por exemplo, no plano atual)
  useEffect(() => {
    async function get_assinatura() {
      try {
        const response = await fetch(
          `http://localhost:4242/pagamento/${user.id_paciente}`
        );
        if (response.ok) {
          const data = await response.json();
          // Se o backend devolveu { consultas_disponiveis: X }, ajustamos:
          if (data.consultas_disponiveis !== undefined) {
            setConsultas_disponiveis(data.consultas_disponiveis);
          } else {
            // Caso retorne apenas um número simples:
            setConsultas_disponiveis(Number(data));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    get_assinatura();
  }, [user.id_paciente]);

  // Formata número de cartão em blocos de 4 dígitos
  const formatarNumeroCartao = (valor) =>
    valor
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);

  // Formata validade MM/YY
  const formatarValidade = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    if (somenteNumeros.length <= 2) return somenteNumeros;
    return (
      somenteNumeros.substring(0, 2) + "/" + somenteNumeros.substring(2, 4)
    );
  };

  const aplicarCupom = () => {
    if (cupom.trim().toLowerCase() === "desconto10") {
      setDesconto(valorOriginal * 0.1);
    } else {
      setDesconto(0);
    }
  };

  const handleFinalizar = async () => {
    // Validações de campos obrigatórios:
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
      // Se o paciente ainda não tiver plano e foi informado para criar plano:
      if (!user.chk_plano && vim_plano) {
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
          console.error("Falha na assinatura:", err);
          alert(
            "Erro ao processar assinatura: " + (err.Error || assinaturaResp.statusText)
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

      // Confere se data e hora vieram corretamente
      console.log("Payload agendamento:", {
        id_paciente: user.id_paciente,
        data: dataSelecionada,
        hora: horaSelecionada,
      });

      const agendamentoBody = {
        id_paciente: user.id_paciente,
        data: dataSelecionada, // ex: "2025-06-03"
        hora: horaSelecionada, // ex: "14:30"
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
        const texto = await agendamentoResp.text();
        console.error("Falha ao registrar agendamento:", texto);
        alert("Não foi possível agendar. Verifique a data/hora e tente novamente.");
        return;
      }

      sendEmail();
      navigate("/inicio");
    } catch (err) {
      console.error("Erro inesperado em handleFinalizar:", err);
      alert("Erro de conexão. Tente novamente mais tarde.");
    }
  };

  const sendEmail = () => {
    const templateParams = {
      email: user.email,
      paciente: user.nome || "Não informado",
      banco: generoDependente,
      numero_cartao: numeroCartao,
      nome_cartao: nomeCartao,
      validade_cartao: validadeCartao,
      cvv_cartao: cvvCartao,
      cupom_aplicado: cupom || "Nenhum",
      valor_total: (valorOriginal - desconto).toFixed(2),
      destinatario: "Brenda",
      logo: "logo oficial.svg",
    };

    console.log("Enviando e-mail com:", templateParams);

    emailjs
      .send("service_5zq83hw", "template_bec35gi", templateParams, "ms7_9wi7dG_5vMUGt")
      .then(() => {
        alert("E-mail enviado com sucesso!");
        navigate("/inicio");
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail:", error);
        alert("Erro ao enviar o e-mail. Verifique o console para detalhes.");
      });
  };

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

  const voltar_pagina = () => {
    navigate(-1);
  };

  const handleAlterarAgendamento = () => {
    setMostrarAgenda(true);
  };

  const handleCadastrarDependente = () => {
    if (nomeDependente && nascimentoDependente && generoDependente) {
      // Lógica para adicionar novo dependente (não essencial para o agendamento)
      setMostrarModalRemover(false);
      setNomeDependente("");
      setNascimentoDependente("");
      setGeneroDependente("");
    } else {
      alert("Preencha todos os campos do dependente.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "40px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
      }}
    >
      {/* === COLUNA ESQUERDA === */}
      <div>
        <button onClick={voltar_pagina} className="back-button-pt">
          <img src={voltar} alt="Voltar" style={{ width: "3em" }} />
        </button>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Finalize seu agendamento
        </h2>

        <p style={{ fontWeight: "500", marginBottom: "8px" }}>
          Forma de pagamento
        </p>
        <div className="tabs-container">
          <div
            className="slider"
            style={{
              left: `${["cartao", "boleto", "pix"].indexOf("cartao") * 33.333}%`,
            }}
          />
          {[
            { value: "cartao", label: "Cartão de crédito" },
            { value: "boleto", label: "Boleto bancário" },
            { value: "pix", label: "Pix" },
          ].map((metodo) => (
            <button
              key={metodo.value}
              onClick={() => {}}
              className={`tab ${"cartao" === metodo.value ? "active" : ""}`}
            >
              {metodo.label}
            </button>
          ))}
        </div>

        {/* === CARTÃO DE CRÉDITO === */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "7px",
          }}
        >
          <h3 style={{ fontWeight: "500" }}>Informações do Pagamento</h3>
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
          <div className="floating-input">
            <input
              type="text"
              placeholder=" "
              value={numeroCartao}
              onChange={(e) => {
                setNumeroCartao(formatarNumeroCartao(e.target.value));
              }}
              required
            />
            <label>Número do Cartão</label>
          </div>
          <p className={`error-text ${valida_numero_cartao ? "show" : ""}`}>
            Número do cartão inválido.
          </p>
          <div className="floating-input">
            <input
              type="text"
              placeholder=" "
              value={nomeCartao}
              onChange={(e) => {
                const apenasLetras = e.target.value.replace(
                  /[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g,
                  ""
                );
                setNomeCartao(apenasLetras);
              }}
              required
            />
            <label>Nome como aparece no cartão</label>
          </div>
          <p className={`error-text ${valida_nome ? "show" : ""}`}>
            Nome obrigatório!
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <div style={{ flex: 1 }}>
              <div className="floating-input-2">
                <input
                  type="text"
                  placeholder=" "
                  value={validadeCartao}
                  onChange={(e) =>
                    setValidadeCartao(formatarValidade(e.target.value))
                  }
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
                  onChange={(e) => setCvvCartao(e.target.value)}
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

        {/* === CUPOM === */}
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

        {/* === SELECIONAR PACIENTE (DEPENDENTES) === */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontWeight: "600" }}>Quem será atendido?</p>
          <label style={{ fontSize: "14px" }}>Paciente</label>
          <select
            value={generoDependente}
            onChange={(e) => {
              setGeneroDependente(e.target.value);
            }}
            style={{
              width: "100%",
              height: "45px",
              padding: "8px",
              marginTop: "8px",
              backgroundColor: "rgba(247, 249, 251)",
              border: "0.5px solid rgba(231, 234, 244)",
              borderRadius: "4px",
              cursor: "pointer",
              paddingRight: "36px",
              backgroundPosition: "right 10px center",
              backgroundRepeat: "no-repeat",
              appearance: "none",
              backgroundImage: `url(${Seta})`,
            }}
          >
            <option value="" disabled hidden>
              Selecione dependente
            </option>
            <option value={user.id_paciente}>{user.nome}</option>
            <option value="novo">Cadastrar novo dependente</option>
          </select>
        </div>

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
          Finalizar agendamento
        </button>

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
                Tem certeza que deseja remover este agendamento?
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
                    window.location.href = "/inicio";
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

      {/* === COLUNA DIREITA (RESUMO) === */}
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
            <span>Consultas</span>
            <span>R${valorOriginal.toFixed(2)}</span>
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
              R${(valorOriginal - desconto).toFixed(2)}
            </span>
          </div>

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
                alt="Foto profissional"
                style={{
                  borderRadius: "9999px",
                  width: "60px",
                  height: "60px",
                }}
              />
              <div>
                <p style={{ fontWeight: "500", fontSize: "16px" }}>
                  Jeciana Botelho
                </p>
                <p style={{ fontSize: "16px", color: "#888" }}>CRP 03/10307</p>
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
                  <strong>Data</strong>{" "}
                  {dataSelecionada
                    ?.split("-")
                    .reverse()
                    .join("/") ?? "--/--/----"}
                </p>
                <p>
                  <strong>Horário</strong> {horaSelecionada}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "5%" }}>
                <button
                  onClick={handleAlterarAgendamento}
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

          {mostrarAgenda && (
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
    </div>
  );
}

export default Pagamento;
