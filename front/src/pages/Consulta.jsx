// src/pages/Consulta.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/Consulta.css";
import imgConsulta from "../assets/Group 239294.svg";
import voltar from "../assets/seta-principal.svg";

// Utilitários
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

const paraDataISO = (dataStr, ano) => {
  const [diaStr, mesStr] = dataStr.split("/");
  const dia = String(parseInt(diaStr, 10)).padStart(2, "0");
  const mes = String(parseInt(mesStr, 10)).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const hoje = new Date();
const horaAtual = hoje.getHours();
const minutoAtual = hoje.getMinutes();

const verificarConsultaPassada = (consulta) => {
  const [horaConsulta, minutoConsulta] = consulta.horario.split(':').map(Number);
  
  const dataConsulta = new Date(
    consulta.ano,
    consulta.mes,
    consulta.dia,
    horaConsulta,
    minutoConsulta
  );
  
  return dataConsulta < hoje;
};

export default function Consulta() {
  // Hooks e parâmetros
  const { role, id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [agendamentos, setAgendamentos] = useState({});
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [indiceMesAtual, setIndiceMesAtual] = useState(hoje.getMonth());
  const [mostrarModalReagendamento, setMostrarModalReagendamento] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [semanaOffset, setSemanaOffset] = useState(0);

  // Dados do calendário
  const mesesDoAno = obterDadosMes(anoAtual);
  const mesAtual = mesesDoAno[indiceMesAtual];
  const mesAnterior = mesesDoAno[(indiceMesAtual + 11) % 12];

  // Grade de dias do calendário principal
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

  // Efeitos
  useEffect(() => {
    buscarConsultas();
  }, [role, id]);

  // Funções da API
  async function buscarConsultas() {
    try {
      let resp;
      if (role === "profissional") {
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth() + 1;
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
        const m = dt.getMonth();
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

  // Funções de navegação
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

  // Funções de manipulação de consulta
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

  const fecharDetalhes = () => {
    setConsultaSelecionada(null);
  };

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

  const confirmarReagendamento = async () => {
    if (!consultaSelecionada || !dataSelecionada || !horaSelecionada) return;
    
    const anoParaISO = hoje.getFullYear();
    const dataISO = paraDataISO(dataSelecionada, anoParaISO);
    
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

  // Funções de renderização do modal de reagendamento
  const renderizarGradeReagendamento = () => {
    const horarios = ["11:00", "13:00", "13:30", "14:30", "16:10", "17:30", "19:20"];

    const referencia = new Date(hoje);
    referencia.setDate(hoje.getDate() + semanaOffset * 7);

    const diaSemanaRef = referencia.getDay();
    const diffParaSegunda = diaSemanaRef === 0 ? -6 : 1 - diaSemanaRef;
    const monday = new Date(referencia);
    monday.setDate(referencia.getDate() + diffParaSegunda);

    const diasSemana = Array.from({ length: 7 }, (_, i) => {
      const data = new Date(monday);
      data.setDate(monday.getDate() + i);

      const diaSemana = data.toLocaleString("pt-BR", { weekday: "short" });
      const dataStr = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const diaPassado = data < hoje;

      return { 
        diaSemana, 
        dataStr, 
        dataObj: data,
        diaPassado 
      };
    });

    return (
      <div className="calendar-grid">
        {diasSemana.map(({ diaSemana, dataStr, dataObj, diaPassado }) => {
          const ehHoje = dataObj.getDate() === hoje.getDate() && 
                        dataObj.getMonth() === hoje.getMonth() && 
                        dataObj.getFullYear() === hoje.getFullYear();

          return (
            <div 
              key={dataStr} 
              className={`calendar-day ${diaPassado ? 'past-day' : ''}`}
            >
              <strong>{diaSemana}</strong>
              <span>{dataStr}</span>
              {horarios.map((h) => {
                const [horaStr, minutoStr] = h.split(':');
                const hora = parseInt(horaStr, 10);
                const minuto = parseInt(minutoStr, 10);
                
                const horarioPassado = ehHoje && (
                  hora < horaAtual || 
                  (hora === horaAtual && minuto <= minutoAtual)
                );
                
                const desabilitado = diaPassado || horarioPassado;

                return (
                  <button
                    key={`${dataStr}-${h}`}
                    className={`hour-btn ${
                      dataSelecionada === dataStr && horaSelecionada === h
                        ? "selected"
                        : ""
                    } ${desabilitado ? 'disabled-hour' : ''}`}
                    onClick={() => {
                      if (!desabilitado) {
                        setDataSelecionada(dataStr);
                        setHoraSelecionada(h);
                      }
                    }}
                    disabled={desabilitado}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const obterTituloSemana = () => {
    const referencia = new Date(hoje);
    referencia.setDate(hoje.getDate() + semanaOffset * 7);
    
    const diaSemanaRef = referencia.getDay();
    const diffParaSegunda = diaSemanaRef === 0 ? -6 : 1 - diaSemanaRef;
    const monday = new Date(referencia);
    monday.setDate(referencia.getDate() + diffParaSegunda);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (d) =>
      d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  // Renderização principal
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
          <button onClick={() => trocarMes(1)} className="setaEsquerda-c">
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
                    {!verificarConsultaPassada(consultaSelecionada) ? (
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
                      <div className="consulta-passada-mensagem">
                        Esta consulta já ocorreu e não pode ser alterada ou cancelada.
                      </div>
                    )}
                  </>
                ) : (
                  !verificarConsultaPassada(consultaSelecionada) && (
                    <button className="remover-c" onClick={cancelarConsulta}>
                      Remover
                    </button>
                  )
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
            <p>Semana: {obterTituloSemana()}</p>

            <div className="calendar-scroll">
              <div className="calendar-title">
                <button
                  onClick={() => setSemanaOffset((prev) => prev - 1)}
                  className="setaE-c"
                  disabled={semanaOffset <= -1}
                >
                  <ChevronLeft />
                </button>
                <h3>{obterTituloSemana()}</h3>
                <button
                  onClick={() => setSemanaOffset((prev) => prev + 1)}
                  className="setaD-c"
                >
                  <ChevronRight />
                </button>
              </div>

              {renderizarGradeReagendamento()}
            </div>

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