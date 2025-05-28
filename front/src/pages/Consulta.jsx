import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/Consulta.css";
import imgConsulta from "../assets/Group 239294.svg";
import voltar from "../assets/voltar 2.svg";

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

  const buscarConsultas = useCallback(async () => {
    try {
      let resp;
  
      if (role === "profissional") {
        resp = await fetch(
          `http://localhost:4242/consulta/profissional/${id}/${anoAtual}/${indiceMesAtual + 1}`
        );
      } else {
        resp = await fetch(`http://localhost:4242/consulta/${id}`);
      }
  
      if (!resp.ok) {
        throw new Error("Falha ao buscar consultas");
      }
      const dados = await resp.json();
  
       const novoMapa = {};
       dados.forEach((registro) => {
         const dt = new Date(registro.data);
         const a = dt.getFullYear();
         const m = dt.getMonth();
         const d = dt.getDate();
         const chave = `${a}-${m}-${d}`;
    
         if (!novoMapa[chave]) novoMapa[chave] = [];
    
         const base = {
           id_consulta: registro.id_consulta,
           horario: registro.hora,
           fotoPar: registro.foto_par || null,
         };
    
         if (role === "profissional") {
           novoMapa[chave].push({ ...base, nomePar: registro.nome_paciente });
         } else {
           novoMapa[chave].push({ ...base, nomePar: registro.nome_profissional });
         }
       });
  
      setAgendamentos(novoMapa);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  }, [role, id, anoAtual, indiceMesAtual]);
  

  useEffect(() => {
    buscarConsultas();
  }, [buscarConsultas]);

  const mesesDoAno = obterDadosMes(anoAtual);
  const mesAtual = mesesDoAno[indiceMesAtual];
  const mesAnterior = mesesDoAno[(indiceMesAtual + 11) % 12];

  const gradeDias = Array.from({ length: 42 }, (_, i) => {
    let dia;
    let mesCorrente;
    let indisponivel;
    let registrosDoDia = [];

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

  const aoSelecionarDia = (diaObj) => {
    if (!diaObj.mesCorrente || diaObj.registrosDoDia.length === 0) return;
    const agendamento = diaObj.registrosDoDia[0];
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
      const resp = await fetch(`/consulta/${consultaSelecionada.id_consulta}`, { method: "DELETE" });
      if (resp.status === 404) {
        alert("Consulta não encontrada");
        return;
      }
      if (!resp.ok) throw new Error("Erro no back-end");

      const chave = `${consultaSelecionada.ano}-${consultaSelecionada.mes}-${consultaSelecionada.dia}`;
      setAgendamentos((prev) => {
        const copia = { ...prev };
        copia[chave] = copia[chave].filter((a) => a.id_consulta !== consultaSelecionada.id_consulta);
        if (copia[chave].length === 0) delete copia[chave];
        return copia;
      });
      fecharDetalhes();
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
      alert("Não foi possível cancelar a consulta.");
    }
  };

  const confirmarReagendamento = async () => {
    if (!consultaSelecionada || !dataSelecionada || !horaSelecionada) return;
    const dataISO = paraDataISO(dataSelecionada, anoReagendamento);
    try {
      const resp = await fetch(`/consulta/${consultaSelecionada.id_consulta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataISO, hora: horaSelecionada }),
      });
      if (resp.status === 404) {
        alert("Consulta não encontrada");
        return;
      }
      if (!resp.ok) throw new Error("Erro no back-end");

      const chaveAntiga = `${consultaSelecionada.ano}-${consultaSelecionada.mes}-${consultaSelecionada.dia}`;
      const dt = new Date(dataISO);
      const chaveNova = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
      const agendamentoAtualizado = {
        id_consulta: consultaSelecionada.id_consulta,
        horario: horaSelecionada,
        nomePar: consultaSelecionada.nomePar,
        fotoPar: consultaSelecionada.fotoPar,
      };

      setAgendamentos((prev) => {
        const copia = { ...prev };
        copia[chaveAntiga] = copia[chaveAntiga].filter((a) => a.id_consulta !== consultaSelecionada.id_consulta);
        if (copia[chaveAntiga].length === 0) delete copia[chaveAntiga];
        if (!copia[chaveNova]) copia[chaveNova] = [agendamentoAtualizado];
        else copia[chaveNova].push(agendamentoAtualizado);
        return copia;
      });

      setConsultaSelecionada((prev) => ({
        ...prev,
        dia: dt.getDate(),
        mes: dt.getMonth(),
        ano: dt.getFullYear(),
        horario: horaSelecionada,
      }));

      setMostrarModalReagendamento(false);
      setMensagemConfirmacao(
        `Consulta reagendada para ${dt.getDate()} de ${new Date(dt.getFullYear(), dt.getMonth()).toLocaleString("pt-BR", { month: "long" })} às ${horaSelecionada}`
      );
    } catch (err) {
      console.error("Erro ao reagendar:", err);
      alert("Não foi possível reagendar a consulta.");
    }
  };

  const renderizarGradeReagendamento = () => {
    const opcoes = [
      { diaSemana: "ter", data: "29/04" },
      { diaSemana: "qua", data: "30/04" },
      { diaSemana: "qui", data: "01/05" },
      { diaSemana: "sex", data: "02/05" },
      { diaSemana: "sáb", data: "03/05" },
      { diaSemana: "dom", data: "04/05" },
      { diaSemana: "seg", data: "05/05" },
    ];
    const horarios = ["08:00", "09:00", "10:00", "11:00"];

    return opcoes.map(({ diaSemana, data }, i) => (
      <div key={i} className="calendar-day">
        <strong>{diaSemana}</strong>
        <span>{data}</span>
        {horarios.map((hora) => (
          <button
            key={hora}
            className={`hour-btn ${dataSelecionada === data && horaSelecionada === hora ? "selected" : ""}`}
            onClick={() => {
              setDataSelecionada(data);
              setHoraSelecionada(hora);
            }}
          >
            {hora}
          </button>
        ))}
      </div>
    ));
  };



  return (
    <div className="container-agenda-c">
      {mensagemConfirmacao && (
        <div className="confirmation-message-c">
          <span>{mensagemConfirmacao}</span>
          <button className="close-confirmation-c" onClick={() => setMensagemConfirmacao("")}> <X size={16} /> </button>
        </div>
      )}

      <button className="back-button-c" onClick={() => navigate(-1)}>
        <img src={voltar} alt="Voltar" />
      </button>

      <section className="calendar-c">
        <header className="calendar-header-c">
          {role === "profissional" && <button onClick={() => trocarMes(-1)} className="setaEsquerda-c"> <ChevronLeft /> </button>}
          <h2>{mesAtual.nome} {anoAtual}</h2>
          {role === "profissional" && <button onClick={() => trocarMes(1)} className="setaDireita-c"> <ChevronRight /> </button>}
        </header>

        <div className="weekdays-c">
          {"Dom Seg Ter Qua Qui Sex Sab".split(" ").map((d) => <div key={d}>{d}</div>)}
        </div>

        <div className="days-grid-c">
          {gradeDias.map((diaObj) => (
            <div
              key={diaObj.id}
              className={`day ${diaObj.indisponivel ? "unavailable" : ""}`}
              onClick={() => aoSelecionarDia(diaObj)}
            >
              <span>{diaObj.dia}</span>
              {diaObj.registrosDoDia.map((ag, idx) => (
                <div key={idx} className="appointment-detail-c"> {ag.horario} </div>
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
        <aside className="schedule-c">
          <button className="close-button-c" onClick={fecharDetalhes}> <X size={24} /> </button>

          <div className="resumo-card-c">
            <div className="agendamento-info-c">

              <div className="par-info-c">
                {consultaSelecionada.fotoPar && <img src={consultaSelecionada.fotoPar} alt="Foto" className="foto-par-c" />}
                <div>
                  <h3>{consultaSelecionada.nomePar}</h3>
                  <p>{role === "paciente" ? "Profissional responsável" : "Paciente agendado"}</p>
                </div>
              </div>

              <div className="detalhes-c">
                <div><strong>Data:</strong> {consultaSelecionada.dia}/{consultaSelecionada.mes + 1}/{consultaSelecionada.ano}</div>
                <div><strong>Horário:</strong> {consultaSelecionada.horario}</div>
                {role === "profissional" && (
                  <div className="valor-consulta-c"><strong>Valor:</strong> R$ 165,00</div>
                )}
              </div>

              <div className="botoes-c">
                {role === "paciente" ? (
                  <>
                    <button className="alterar-c" onClick={() => setMostrarModalReagendamento(true)}>Alterar</button>
                    <button className="remover-c" onClick={cancelarConsulta}>Remover</button>
                  </>
                ) : (
                  <button className="remover-c" onClick={cancelarConsulta}>Remover</button>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}

      {mostrarModalReagendamento && (
        <div className="reschedule-modal-overlay">
          <div className="reschedule-modal">
            <button className="modal-close-btn" onClick={() => setMostrarModalReagendamento(false)}> <X size={20} /> </button>
            <h2>Reagendamento de consulta</h2>
            <p>Escolha dia e horário:</p>

            <div className="calendar-scroll">
              <div className="calendar-title">
                <button onClick={() => { let nm = indiceMesReagendamento - 1; let na = anoReagendamento; if (nm < 0) { nm = 11; na -= 1; } setIndiceMesReagendamento(nm); setAnoReagendamento(na); }} className="setaE-c"> <ChevronLeft /> </button>
                <h3>{new Date(anoReagendamento, indiceMesReagendamento).toLocaleString("pt-BR", { month: "long", year: "numeric" })}</h3>
                <button onClick={() => { let nm = indiceMesReagendamento + 1; let na = anoReagendamento; if (nm > 11) { nm = 0; na += 1; } setIndiceMesReagendamento(nm); setAnoReagendamento(na); }} className="setaD-c"> <ChevronRight /> </button>
              </div>

              <div className="calendar-grid">
                {renderizarGradeReagendamento()}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-back" onClick={() => setMostrarModalReagendamento(false)}>Voltar</button>
              <button className="btn-confirm" disabled={!dataSelecionada || !horaSelecionada} onClick={confirmarReagendamento}>Reagendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
