import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/Consulta.css";
import imgConsulta from "../assets/Group 239294.svg";
import voltar from "../assets/seta-principal.svg";
import icon from "../assets/icon-profile.svg";

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

const verificarConsultaPassada = (consulta) => {
  const [horaConsulta, minutoConsulta] = consulta.horario.split(":").map(Number);
  const hojeParaComparacao = new Date();
  const dataConsulta = new Date(
    consulta.ano,
    consulta.mes,
    consulta.dia,
    horaConsulta,
    minutoConsulta
  );
  return dataConsulta < hojeParaComparacao;
};

function Consulta() {
  const { role, id } = useParams();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState({});
  const [agendamentosProfissional, setAgendamentosProfissional] = useState({});
  const [fetchedMonthsForProfessional, setFetchedMonthsForProfessional] = useState(new Set());
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [indiceMesAtual, setIndiceMesAtual] = useState(new Date().getMonth());
  const [mostrarModalReagendamento, setMostrarModalReagendamento] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [foto, setFoto] = useState();

  useEffect(() => {
    const getFoto = async () => {
      try {
        const response = await fetch(
          `https://futuremind-2-0.onrender.com/profissional/${consultaSelecionada?.id_profissional}`
        );
        if (!response.ok) return;
        const data = await response.json();
        setFoto(data?.foto?.startsWith("http") ? data.foto : data?.foto === 'icone_usuario.svg' ? '/public/icone-usuario.svg' : `http://localhost:4242${data.foto}`);
      } catch (err) {
        console.error("Erro ao buscar foto:", err);
      }
    };
    if (consultaSelecionada?.id_profissional) getFoto();
  }, [consultaSelecionada]);

  const mesesDoAno = useMemo(() => obterDadosMes(anoAtual), [anoAtual]);
  const mesAtual = useMemo(() => mesesDoAno[indiceMesAtual], [mesesDoAno, indiceMesAtual]);

  const gradeDias = useMemo(() => {
    const hojeData = new Date();
    hojeData.setHours(0, 0, 0, 0);

    return Array.from({ length: 42 }, (_, i) => {
      const firstDayOfMonth = new Date(anoAtual, indiceMesAtual, 1);
      const startDayOffset = firstDayOfMonth.getDay();
      const dateForCell = new Date(anoAtual, indiceMesAtual, 1);
      dateForCell.setDate(firstDayOfMonth.getDate() + (i - startDayOffset));

      const dia = dateForCell?.getDate();
      const mesCalculado = dateForCell.getMonth();
      const anoCalculado = dateForCell.getFullYear();
      const mesCorrente = (mesCalculado === indiceMesAtual && anoCalculado === anoAtual);
      const chave = `${anoCalculado}-${mesCalculado}-${dia}`;
      const registrosDoDia = agendamentos[chave] || [];
      const currentDayDate = new Date(anoCalculado, mesCalculado, dia);
      currentDayDate.setHours(0, 0, 0, 0);
      const indisponivel = !mesCorrente || (currentDayDate < hojeData && registrosDoDia.length === 0);

      return {
        id: chave,
        dia,
        mes: mesCalculado,
        ano: anoCalculado,
        mesCorrente,
        indisponivel,
        registrosDoDia
      };
    });
  }, [anoAtual, indiceMesAtual, agendamentos]);

  const buscarAgendamentosProfissionalParaReagendamento = useCallback(async (professionalId, year, month) => {
    setLoading(true);
    try {
      const resp = await fetch(
        `https://futuremind-2-0.onrender.com/consulta/profissional/${professionalId}/${year}/${month}`
      );
      if (!resp.ok) throw new Error("Falha ao buscar consultas do profissional");

      const dados = await resp.json();
      setAgendamentosProfissional(prev => {
        const newMap = { ...prev };
        dados.forEach((registro) => {
          const dt = new Date(registro.data);
          const chave = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
          if (!newMap[chave]) newMap[chave] = [];
          newMap[chave].push({ horario: registro.hora });
        });
        return newMap;
      });
    } catch (e) {
      console.error("Erro ao buscar agendamentos:", e);
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarConsultasUsuarioPrincipal = useCallback(async (currentYear, currentMonthIndex) => {
    setLoading(true);
    try {
      const respUser = role === "profissional"
        ? await fetch(`https://futuremind-2-0.onrender.com/consulta/profissional/${id}/${currentYear}/${currentMonthIndex + 1}`)
        : await fetch(`https://futuremind-2-0.onrender.com/consulta/${id}`);

      if (!respUser.ok) throw new Error("Falha ao buscar consultas");

      const dadosUser = await respUser.json();
      const novoMapaUser = {};

      dadosUser.forEach((registro) => {
        const dt = new Date(registro.data);
        const chave = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
        if (!novoMapaUser[chave]) novoMapaUser[chave] = [];
        novoMapaUser[chave].push({
          id_consulta: registro.id_consulta || registro.id_consultas,
          horario: registro.hora,
          nomePar: role === "profissional" ? registro.nome_paciente : registro.nome_profissional,
          fotoPar: role === "profissional" ? registro.foto_paciente : registro.foto_profissional,
          id_profissional: registro.id_profissional,
        });
      });
      setAgendamentos(novoMapaUser);
    } catch (e) {
      console.error("Erro ao buscar consultas:", e);
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }, [role, id]);

  useEffect(() => {
    buscarConsultasUsuarioPrincipal(anoAtual, indiceMesAtual);
  }, [anoAtual, indiceMesAtual, buscarConsultasUsuarioPrincipal]);

  useEffect(() => {
    if (mostrarModalReagendamento && consultaSelecionada && role === "paciente") {
      const professionalId = consultaSelecionada.id_profissional;
      if (professionalId) {
        const hojeReferencia = new Date();
        const referencia = new Date(hojeReferencia);
        referencia.setDate(hojeReferencia.getDate() + semanaOffset * 7);
        const monthKey = `${referencia.getFullYear()}-${referencia.getMonth() + 1}`;
        
        if (!fetchedMonthsForProfessional.has(monthKey)) {
          buscarAgendamentosProfissionalParaReagendamento(
            professionalId,
            referencia.getFullYear(),
            referencia.getMonth() + 1
          );
          setFetchedMonthsForProfessional(prev => new Set(prev).add(monthKey));
        }
      }
    }
  }, [semanaOffset, mostrarModalReagendamento, consultaSelecionada, role, buscarAgendamentosProfissionalParaReagendamento, fetchedMonthsForProfessional]);

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

  const aoSelecionarHorario = (diaObj, agendamento) => {
    setConsultaSelecionada({
      dia: diaObj.dia,
      mes: diaObj.mes,
      ano: diaObj.ano,
      id_profissional: agendamento.id_profissional,
      ...agendamento,
    });
    setDataSelecionada(null);
    setHoraSelecionada(null);
  };

  const fecharDetalhes = () => setConsultaSelecionada(null);

  const cancelarConsulta = async () => {
    if (!consultaSelecionada || verificarConsultaPassada(consultaSelecionada)) {
      alert("Não é possível cancelar consultas passadas.");
      return;
    }

    try {
      const resp = await fetch(
        `https://futuremind-2-0.onrender.com/consulta/${consultaSelecionada.id_consulta}`,
        { method: "DELETE" }
      );
      if (!resp.ok) throw new Error("Erro ao cancelar consulta");
      await buscarConsultasUsuarioPrincipal(anoAtual, indiceMesAtual);
      fecharDetalhes();
      setMensagemConfirmacao("Consulta cancelada com sucesso!");
    } catch (err) {
      console.error("Erro ao cancelar:", err);
      alert(err.message || "Erro ao cancelar consulta");
    }
  };

  const handleAlterarConsultaClick = async () => {
    if (consultaSelecionada && role === "paciente") {
      setMostrarModalReagendamento(true);
      setAgendamentosProfissional({});
      setFetchedMonthsForProfessional(new Set());
      setSemanaOffset(0);

      const professionalId = consultaSelecionada.id_profissional;
      if (professionalId) {
        const today = new Date();
        for (let i = 0; i < 4; i++) {
          const targetDate = new Date(today);
          targetDate.setMonth(today.getMonth() + i);
          const monthKey = `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}`;
          if (!fetchedMonthsForProfessional.has(monthKey)) {
            await buscarAgendamentosProfissionalParaReagendamento(
              professionalId,
              targetDate.getFullYear(),
              targetDate.getMonth() + 1
            );
            setFetchedMonthsForProfessional(prev => new Set(prev).add(monthKey));
          }
        }
      } else {
        alert("Profissional não encontrado.");
        setMostrarModalReagendamento(false);
      }
    }
  };

  const confirmarReagendamento = async () => {
    if (!consultaSelecionada || !dataSelecionada || !horaSelecionada) {
      console.log("Por favor, selecione uma nova data e horário para reagendar.");
      return;
    }

    const [diaStr, mesStr] = dataSelecionada.split('/');
    const hojeData = new Date();
    let anoReagendamento = consultaSelecionada.ano;
    const novaDataTemp = new Date(anoReagendamento, parseInt(mesStr, 10) - 1, parseInt(diaStr, 10));

    if (novaDataTemp < new Date(consultaSelecionada.ano, consultaSelecionada.mes, consultaSelecionada.dia) &&
        (parseInt(mesStr, 10) - 1) < consultaSelecionada.mes) {
        anoReagendamento = hojeData.getFullYear() + 1;
    } else {
        anoReagendamento = hojeData.getFullYear();
    }

    const dataISO = `${anoReagendamento}-${String(parseInt(mesStr, 10)).padStart(2, '0')}-${String(parseInt(diaStr, 10)).padStart(2, '0')}`;

    try {
      const resp = await fetch(
        `https://futuremind-2-0.onrender.com/consulta/${consultaSelecionada.id_consulta}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataISO, hora: horaSelecionada }),
        }
      );
      if (!resp.ok) throw new Error("Erro ao reagendar");
      await buscarConsultasUsuarioPrincipal(anoAtual, indiceMesAtual);
      setMostrarModalReagendamento(false);
      setMensagemConfirmacao(`Consulta reagendada para ${dataSelecionada} às ${horaSelecionada}`);
      setConsultaSelecionada(null);
    } catch (err) {
      console.error("Erro ao reagendar:", err);
      console.log(err.message || "Não foi possível reagendar a consulta.");
    }
  };

  const obterTituloSemana = useCallback(() => {
    const hojeData = new Date();
    const referencia = new Date(hojeData);
    referencia.setDate(hojeData.getDate() + semanaOffset * 7);
    const diaSemanaRef = referencia.getDay();
    const diffParaSegunda = diaSemanaRef === 0 ? -6 : 1 - diaSemanaRef;
    const monday = new Date(referencia);
    monday.setDate(referencia.getDate() + diffParaSegunda);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const formatDate = (d) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  }, [semanaOffset]);

  const renderizarGradeReagendamento = useCallback(() => {
    const horarios = ["11:00", "13:00", "13:30", "14:30", "16:10", "17:30", "19:20"];
    const hojeData = new Date();
    const horaAtual = hojeData.getHours();
    const minutoAtual = hojeData.getMinutes();
    const referencia = new Date(hojeData);
    referencia.setDate(hojeData.getDate() + semanaOffset * 7);
    const diaSemanaRef = referencia.getDay();
    const diffParaSegunda = diaSemanaRef === 0 ? -6 : 1 - diaSemanaRef;
    const monday = new Date(referencia);
    monday.setDate(referencia.getDate() + diffParaSegunda);
    monday.setHours(0, 0, 0, 0);

    const diasSemana = Array.from({ length: 7 }, (_, i) => {
      const data = new Date(monday);
      data.setDate(monday.getDate() + i);
      const diaSemana = data.toLocaleString("pt-BR", { weekday: "short" });
      const dataStr = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const chaveAgendamento = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
      const agendamentosNoDia = agendamentosProfissional[chaveAgendamento] || [];
      const hojeNormalized = new Date();
      hojeNormalized.setHours(0, 0, 0, 0);
      const diaPassado = data < hojeNormalized;

      return {
        diaSemana,
        dataStr,
        dataObj: data,
        diaPassado,
        agendamentosNoDia,
      };
    });

    return (
      <div className="calendar-grid">
        {diasSemana.map(({ diaSemana, dataStr, dataObj, diaPassado, agendamentosNoDia }) => {
          const ehHoje = dataObj.getDate() === hojeData.getDate() &&
                         dataObj.getMonth() === hojeData.getMonth() &&
                         dataObj.getFullYear() === hojeData.getFullYear();

          return (
            <div key={dataStr} className={`calendar-day ${diaPassado ? "past-day" : ""}`}>
              <strong>{diaSemana}</strong>
              <span>{dataStr}</span>
              {horarios.map((h) => {
                const [horaStr, minutoStr] = h.split(":");
                const hora = parseInt(horaStr, 10);
                const minuto = parseInt(minutoStr, 10);
                const horarioPassado = ehHoje && (hora < horaAtual || (hora === horaAtual && minuto <= minutoAtual));
                const horarioJaOcupado = agendamentosNoDia.some(ag => ag.horario === h);
                const desabilitado = diaPassado || horarioPassado || horarioJaOcupado;

                return (
                  <button
                    key={`${dataStr}-${h}`}
                    className={`hour-btn ${
                      dataSelecionada === dataStr && horaSelecionada === h ? "selected" : ""
                    } ${desabilitado ? "disabled-hour" : ""}`}
                    onClick={() => !desabilitado && (setDataSelecionada(dataStr), setHoraSelecionada(h))}
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
  }, [semanaOffset, agendamentosProfissional, dataSelecionada, horaSelecionada]);

  return (
    <div className="container-agenda-c">
      {mensagemConfirmacao && (
        <div className="confirmation-message-c">
          <span>{mensagemConfirmacao}</span>
          <button className="close-confirmation-c" onClick={() => setMensagemConfirmacao("")}>
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
          <h2>{mesAtual.nome} {anoAtual}</h2>
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
            <div key={diaObj.id} className={`day-c ${diaObj.indisponivel ? "unavailable-c" : ""}`}>
              <span>{diaObj.dia}</span>
              {diaObj.registrosDoDia.map((ag, idx) => {
                const isPastAppointment = verificarConsultaPassada({
                  ano: diaObj.ano,
                  mes: diaObj.mes,
                  dia: diaObj.dia,
                  horario: ag.horario
                });
                return (
                  <div
                    key={idx}
                    className={`appointment-detail-c ${isPastAppointment ? "past-appointment" : ""}`}
                    onClick={() => aoSelecionarHorario(diaObj, ag)}
                  >
                    {ag.horario}
                  </div>
                );
              })}
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
                {foto && (
                  <img
                    src={foto.startsWith('http') ? foto : icon}
                    alt="Foto"
                    className="foto-profissional-c"
                  />
                )}
                <div>
                  <h3>{consultaSelecionada.nomePar}</h3>
                  <p>
                    {role === "profissional" ? "Paciente agendado" : "Profissional responsável"}
                  </p>
                </div>
              </div>

              <div className="detalhes-c">
                <div>
                  <strong>Data:</strong> {consultaSelecionada.dia}/{consultaSelecionada.mes + 1}/{consultaSelecionada.ano}
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
                        <button className="alterar-c" onClick={handleAlterarConsultaClick}>
                          Alterar
                        </button>
                        <button className="remover-c" onClick={cancelarConsulta}>
                          Remover
                        </button>
                      </>
                    ) : (
                      <div className="consulta-passada-mensagem">
                        Esta consulta já ocorreu
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
                  disabled={semanaOffset <= 0}
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

export default Consulta;