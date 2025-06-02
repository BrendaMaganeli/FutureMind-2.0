// src/pages/Consulta.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/Consulta.css";
import imgConsulta from "../assets/Group 239294.svg";
import voltar from "../assets/voltar 2.svg";

// Utilitário: gera dados de cada mês (nome, total de dias e dia da semana do dia 1º)
const obterDadosMes = (ano) => {
  const bissexto = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0);
  const diasNoMes = [
    31,
    bissexto ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return diasNoMes.map((dias, indice) => ({
    nome: new Date(ano, indice).toLocaleString("pt-BR", { month: "long" }),
    totalDias: dias,
    inicio: new Date(ano, indice, 1).getDay(),
  }));
};

// Utilitário: converte "DD/MM" + ano em ISO "YYYY-MM-DD"
const paraDataISO = (dataStr, ano) => {
  const [diaStr, mesStr] = dataStr.split("/");
  const dia = String(parseInt(diaStr, 10)).padStart(2, "0");
  const mes = String(parseInt(mesStr, 10)).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export default function Consulta() {
  const { role, id } = useParams();
  const navigate = useNavigate();
  const hoje = new Date();

  const [agendamentos, setAgendamentos] = useState({});
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);

  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [indiceMesAtual, setIndiceMesAtual] = useState(hoje.getMonth());

  const [mostrarModalReagendamento, setMostrarModalReagendamento] = useState(false);
  const [indiceMesReagendamento, setIndiceMesReagendamento] = useState(hoje.getMonth());
  const [anoReagendamento, setAnoReagendamento] = useState(hoje.getFullYear());
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Função que busca consultas do back-end conforme role
  async function buscarConsultas() {
    try {
      let resp;
      if (role === "profissional") {
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth() + 1; // 1..12
        resp = await fetch(
          `http://localhost:4242/consulta/profissional/${id}/${ano}/${mes}`
        );
      } else {
        resp = await fetch(`http://localhost:4242/consulta/${id}`);
      }
      if (!resp.ok) throw new Error("Falha ao buscar consultas");

      const dados = await resp.json();
      const novoMapa = {};

      dados.forEach((registro) => {
        const dt = new Date(registro.data);
        const a = dt.getFullYear();
        const m = dt.getMonth(); // 0..11
        const d = dt.getDate();
        const chave = `${a}-${m}-${d}`;

        if (!novoMapa[chave]) novoMapa[chave] = [];
        novoMapa[chave].push({
          id_consulta: registro.id_consulta || registro.id_consultas,
          horario: registro.hora,
          nomePar:
            role === "profissional"
              ? registro.nome_paciente
              : registro.nome_profissional,
          fotoPar:
            role === "profissional"
              ? registro.foto_paciente
              : registro.foto_profissional,
        });
      });

      setAgendamentos(novoMapa);
      setErro(null);
    } catch (e) {
      console.error(e);
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Chama buscarConsultas na montagem e sempre que role ou id mudarem
  useEffect(() => {
    buscarConsultas();
  }, [role, id]);

  if (loading) {
    return <div>Carregando consultas...</div>;
  }
  if (erro) {
    return <div style={{ color: "red" }}>Erro: {erro}</div>;
  }

  // Dados do calendário principal
  const mesesDoAno = obterDadosMes(anoAtual);
  const mesAtual = mesesDoAno[indiceMesAtual];
  const mesAnterior = mesesDoAno[(indiceMesAtual + 11) % 12];

  // Gera as 42 células do calendário
  const gradeDias = Array.from({ length: 42 }, (_, i) => {
    let dia, mesCorrente, indisponivel, registrosDoDia = [];

    if (i < mesAtual.inicio) {
      dia = mesAnterior.totalDias - (mesAtual.inicio - i - 1);
      mesCorrente = false;
      indisponivel = true;
    } else if (i >= mesAtual.inicio + mesAtual.totalDias) {
      dia = i - (mesAtual.inicio + mesAtual.totalDias) + 1;
      mesCorrente = false;
      indisponivel = true;
    } else {
      dia = i - mesAtual.inicio + 1;
      mesCorrente = true;
      const chave = `${anoAtual}-${indiceMesAtual}-${dia}`;
      registrosDoDia = agendamentos[chave] || [];
      indisponivel = registrosDoDia.length === 0;
    }

    return { id: `${id}-${i}`, dia, mesCorrente, indisponivel, registrosDoDia };
  });

  // Navega entre meses no calendário principal (para profissional)
  const trocarMes = (direcao) => {
    setIndiceMesAtual((prev) => {
      let novoMes = prev + direcao;
      let novoAno = anoAtual;
      if (novoMes < 0) {
        novoMes = 11;
        novoAno -= 1;
      } else if (novoMes > 11) {
        novoMes = 0;
        novoAno += 1;
      }
      setAnoAtual(novoAno);
      return novoMes;
    });
  };

  // Ao clicar num horário em uma célula, abre detalhes
  const aoSelecionarHorario = (diaObj, agendamento) => {
    setConsultaSelecionada({
      dia: diaObj.dia,
      mes: indiceMesAtual,
      ano: anoAtual,
      ...agendamento,
    });
    setMostrarModalReagendamento(false);
    setDataSelecionada(null);
    setHoraSelecionada(null);
  };

  // Fecha o cartão de detalhes
  const fecharDetalhes = () => {
    setConsultaSelecionada(null);
  };

  // Cancela consulta (DELETE) e refaz o fetch
  const cancelarConsulta = async () => {
    if (!consultaSelecionada) return;
    try {
      const resp = await fetch(
        `http://localhost:4242/consulta/${consultaSelecionada.id_consulta}`,
        { method: "DELETE" }
      );
      if (resp.status === 404) {
        alert("Consulta não encontrada");
        return;
      }
      if (!resp.ok) throw new Error("Erro no back-end ao deletar");

      await buscarConsultas();
      fecharDetalhes();
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
      alert("Não foi possível cancelar a consulta.");
    }
  };

  // Confirma reagendamento (PUT) e refaz o fetch
  const confirmarReagendamento = async () => {
    if (!consultaSelecionada || !dataSelecionada || !horaSelecionada) return;
    const dataISO = paraDataISO(dataSelecionada, anoReagendamento);
    try {
      const resp = await fetch(
        `http://localhost:4242/consulta/${consultaSelecionada.id_consulta}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataISO, hora: horaSelecionada }),
        }
      );
      if (resp.status === 404) {
        alert("Consulta não encontrada");
        return;
      }
      if (!resp.ok) throw new Error("Erro no back-end ao reagendar");

      await buscarConsultas();
      setMostrarModalReagendamento(false);
      setMensagemConfirmacao(
        `Consulta reagendada para ${dataSelecionada} às ${horaSelecionada}`
      );
      setConsultaSelecionada(null);
    } catch (err) {
      console.error("Erro ao reagendar:", err);
      alert("Não foi possível reagendar a consulta.");
    }
  };

  // Gera dinamicamente a grade de dias e horários para reagendar
  const renderizarGradeReagendamento = () => {
    const horarios = ["08:00", "09:00", "10:00", "11:00"];
    const primeiroDiaMes = new Date(anoReagendamento, indiceMesReagendamento, 1);
    const diaSemanaInicio = primeiroDiaMes.getDay(); // 0 = domingo

    // Ajusta para começar na segunda-feira (ou domingo = -6)
    const offset = diaSemanaInicio === 0 ? -6 : 1 - diaSemanaInicio;
    const dataBase = new Date(
      anoReagendamento,
      indiceMesReagendamento,
      1 + offset
    );

    const diasSemana = Array.from({ length: 7 }, (_, i) => {
      const data = new Date(dataBase);
      data.setDate(data.getDate() + i);

      const diaSemana = data.toLocaleString("pt-BR", { weekday: "short" });
      const dataStr = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });

      return { diaSemana, dataStr };
    });

    return (
      <div className="calendar-grid">
        {diasSemana.map(({ diaSemana, dataStr }) => (
          <div key={dataStr} className="calendar-day">
            <strong>{diaSemana}</strong>
            <span>{dataStr}</span>
            {horarios.map((h) => (
              <button
                key={`${dataStr}-${h}`}
                className={`hour-btn ${
                  dataSelecionada === dataStr && horaSelecionada === h
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setDataSelecionada(dataStr);
                  setHoraSelecionada(h);
                }}
              >
                {h}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-agenda-c">
      {mensagemConfirmacao && (
        <div className="confirmation-message-c">
          <span>{mensagemConfirmacao}</span>
          <button
            className="close-confirmation-c"
            onClick={() => setMensagemConfirmacao("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <button className="back-button-c" onClick={() => navigate(-1)}>
        <img src={voltar} alt="Voltar" />
      </button>

      <section className="calendar-c">
        <div className="calendar-header-c">
          <button onClick={() => trocarMes(-1)} className="setaEsquerda-c">
            <ChevronLeft />
          </button>
          <h2>
            {mesAtual.nome} {anoAtual}
          </h2>
          <button onClick={() => trocarMes(1)} className="setaDireita-c">
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays-c">
          {"Dom Seg Ter Qua Qui Sex Sab".split(" ").map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="days-grid-c">
          {gradeDias.map((diaObj) => (
            <div
              key={diaObj.id}
              className={`day-c ${diaObj.indisponivel ? "unavailable-c" : ""}`}
            >
              <span>{diaObj.dia}</span>
              {diaObj.registrosDoDia.map((ag, idx) => (
                <div
                  key={idx}
                  className="appointment-detail-c"
                  onClick={() => aoSelecionarHorario(diaObj, ag)}
                >
                  {ag.horario}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="divimg-c">
        <h1 className="agenda0104">Agenda de Consultas</h1>
        {!consultaSelecionada ? (
          <img src={imgConsulta} alt="Sem seleção" />
        ) : (
          <div className="disabledimage"></div>
        )}
      </div>

      {consultaSelecionada && (
        <div className="schedule-c">
          <button className="close-button-c" onClick={fecharDetalhes}>
            <X size={24} />
          </button>
          <div className="resumo-card-c">
            <div className="agendamento-info-c">
              <div className="profissional-c">
                {consultaSelecionada.fotoPar && (
                  <img
                    src={consultaSelecionada.fotoPar}
                    alt="Foto"
                    className="foto-profissional-c"
                  />
                )}
                <div>
                  <h3>{consultaSelecionada.nomePar}</h3>
                  <p>
                    {role === "paciente"
                      ? "Profissional responsável"
                      : "Paciente agendado"}
                  </p>
                </div>
              </div>

              <div className="detalhes-c">
                <div>
                  <strong>Data:</strong> {consultaSelecionada.dia}/
                  {consultaSelecionada.mes + 1}/{consultaSelecionada.ano}
                </div>
                <div>
                  <strong>Horário:</strong> {consultaSelecionada.horario}
                </div>
                {role === "profissional" && (
                  <div className="valor-consulta-c">
                    <strong>Valor:</strong> R$ 165,00
                  </div>
                )}
              </div>

              <div className="botoes-c">
                {role === "paciente" ? (
                  <>
                    <button
                      className="alterar-c"
                      onClick={() => setMostrarModalReagendamento(true)}
                    >
                      Alterar
                    </button>
                    <button className="remover-c" onClick={cancelarConsulta}>
                      Remover
                    </button>
                  </>
                ) : (
                  <button className="remover-c" onClick={cancelarConsulta}>
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalReagendamento && (
        <div className="reschedule-modal-overlay">
          <div className="reschedule-modal">
            <button
              className="modal-close-btn"
              onClick={() => setMostrarModalReagendamento(false)}
            >
              <X size={20} />
            </button>
            <h2>Reagendamento de consulta</h2>
            <p>Escolha dia e horário:</p>

            <div className="calendar-scroll">
              <div className="calendar-title">
                <button
                  onClick={() => {
                    let nm = indiceMesReagendamento - 1;
                    let na = anoReagendamento;
                    if (nm < 0) {
                      nm = 11;
                      na -= 1;
                    }
                    setIndiceMesReagendamento(nm);
                    setAnoReagendamento(na);
                  }}
                  className="setaE-c"
                >
                  <ChevronLeft />
                </button>
                <h3>
                  {new Date(anoReagendamento, indiceMesReagendamento).toLocaleString(
                    "pt-BR",
                    { month: "long", year: "numeric" }
                  )}
                </h3>
                <button
                  onClick={() => {
                    let nm = indiceMesReagendamento + 1;
                    let na = anoReagendamento;
                    if (nm > 11) {
                      nm = 0;
                      na += 1;
                    }
                    setIndiceMesReagendamento(nm);
                    setAnoReagendamento(na);
                  }}
                  className="setaD-c"
                >
                  <ChevronRight />
                </button>
              </div>

              {renderizarGradeReagendamento()}
            </div>-

            <div className="modal-actions">
              <button
                className="btn-back"
                onClick={() => setMostrarModalReagendamento(false)}
              >
                Voltar
              </button>
              <button
                className="btn-confirm"
                disabled={!dataSelecionada || !horaSelecionada}
                onClick={confirmarReagendamento}
              >
                Reagendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
