import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/TelaAgendamento.css";
import imgConsulta from "../assets/Group 239294.svg";
import voltar from "../assets/seta-principal.svg";
import { useNavigate, useParams } from "react-router-dom";

const calcularDadosDoMes = (ano) => {
  const AnoBissexto = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0);
  const diasPorMes = [
    31, AnoBissexto ? 29 : 28, 31, 30, 31, 30, 
    31, 31, 30, 31, 30, 31
  ];
  
  return diasPorMes.map((dias, indice) => ({
    nome: new Date(ano, indice).toLocaleString("default", { month: "long" }),
    dias,
    inicio: new Date(ano, indice, 1).getDay(),
  }));
};

const verificarSeHorarioPassou = (ano, mes, dia, horario) => {
  const agora = new Date();
  const [horas, minutos] = horario.split(':').map(Number);
  const dataAgendamento = new Date(ano, mes, dia, horas, minutos);
  return dataAgendamento < agora;
};

const verificarSeDataPassou = (ano, mes, dia) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return new Date(ano, mes, dia) < hoje;
};

function AgendaConsultas() {
  const hoje = new Date();
  const navegar = useNavigate();
  const { id } = useParams();
  const usuario = JSON.parse(localStorage.getItem("User-Profile"));

  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [indiceMesAtual, setIndiceMesAtual] = useState(hoje.getMonth());
  const [consultasAgendadas, setConsultasAgendadas] = useState({});
  const [slotSelecionado, setSlotSelecionado] = useState({ dia: null, horario: null });
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [convenioSelecionado, setConvenioSelecionado] = useState("");
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState("");

  const meses = calcularDadosDoMes(anoAtual);
  const mesAtual = meses[indiceMesAtual];
  const mesAnterior = meses[(indiceMesAtual + 11) % 12];
  const chaveAgendamento = `${anoAtual}-${indiceMesAtual}-${slotSelecionado.dia}`;
  const horariosAgendados = consultasAgendadas[chaveAgendamento] || [];

  const diasDoCalendario = Array.from({ length: 42 }, (_, indice) => {
    let dia, ehMesAtual = true, estaIndisponivel = false, 
        ehDataPassada = false, consultasDoDia = [];

    if (indice < mesAtual.inicio) {
      dia = mesAnterior.dias - (mesAtual.inicio - indice - 1);
      ehMesAtual = false;
      estaIndisponivel = true;
    } else if (indice >= mesAtual.inicio + mesAtual.dias) {
      dia = indice - (mesAtual.inicio + mesAtual.dias) + 1;
      ehMesAtual = false;
      estaIndisponivel = true;
    } else {
      dia = indice - mesAtual.inicio + 1;
      const chaveDia = `${anoAtual}-${indiceMesAtual}-${dia}`;
      consultasDoDia = consultasAgendadas[chaveDia] || [];
      ehDataPassada = verificarSeDataPassou(anoAtual, indiceMesAtual, dia);
      estaIndisponivel = consultasDoDia.length > 0 || ehDataPassada;
    }

    return { 
      id: indice, 
      dia, 
      ehMesAtual, 
      estaIndisponivel, 
      ehDataPassada,
      consultasDoDia 
    };
  });

  useEffect(() => {
    const buscarConsultasAgendadas = async () => {
      try {
        const mesSQL = indiceMesAtual + 1;
        const resposta = await fetch(
          `http://localhost:4242/agendamento/${id}/${anoAtual}/${mesSQL}`
        );
        
        if (!resposta.ok) throw new Error("Falha ao buscar agendamentos");
        
        const dados = await resposta.json();
        const mapaConsultas = dados.reduce((acumulador, consulta) => {
          const dia = new Date(consulta.data).getDate();
          const chave = `${anoAtual}-${indiceMesAtual}-${dia}`;
          acumulador[chave] = acumulador[chave] || [];
          acumulador[chave].push(consulta.hora);
          return acumulador;
        }, {});
        
        setConsultasAgendadas(mapaConsultas);
      } catch (erro) {
        console.error("Erro ao buscar consultas:", erro);
      }
    };

    buscarConsultasAgendadas();
  }, [anoAtual, indiceMesAtual, id]);

  const navegarEntreMeses = (direcao) => {
    setIndiceMesAtual((mesAnterior) => {
      let novoMes = mesAnterior + direcao;
      let novoAno = anoAtual;
      
      if (novoMes < 0) {
        novoMes = 11;
        novoAno--;
      } else if (novoMes > 11) {
        novoMes = 0;
        novoAno++;
      }
      
      setAnoAtual(novoAno);
      return novoMes;
    });
  };

  const selecionarDia = (dia) => {
    if (dia.ehMesAtual && !dia.ehDataPassada) {
      setSlotSelecionado({ dia: dia.dia, horario: null });
      // Resetar seleções ao mudar de dia
      setConvenioSelecionado("");
      setProcedimentoSelecionado("");
    }
  };

  const selecionarHorario = (horario) => {
    const horarioPassou = verificarSeHorarioPassou(
      anoAtual, 
      indiceMesAtual, 
      slotSelecionado.dia, 
      horario
    );

    if (!horariosAgendados.includes(horario) && !horarioPassou) {
      setSlotSelecionado(anterior => ({ ...anterior, horario }));
    }
  };

  const confirmarAgendamento = () => {
    if (!slotSelecionado.horario || !convenioSelecionado || !procedimentoSelecionado) {
      setMensagemConfirmacao("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const dataFormatada = `${anoAtual}-${String(indiceMesAtual + 1).padStart(2, "0")}-${String(slotSelecionado.dia).padStart(2, "0")}`;
    
    navegar(`/pagamento/${id}?vim_agendamento=true`, {
      state: { 
        date: dataFormatada, 
        time: slotSelecionado.horario,
        convenio: convenioSelecionado,
        procedimento: procedimentoSelecionado 
      },
    });
  };

  const fecharPainelAgendamento = () => setSlotSelecionado({ dia: null, horario: null });
  const fecharMensagemConfirmacao = () => setMensagemConfirmacao("");
  const voltarPaginaAnterior = () => navegar(-1);

  const horariosDisponiveis = [
    "14:30", "17:30", "13:00", 
    "16:10", "11:00", "19:20", "13:30"
  ];

  return (
    <div className="container-agenda">
      {mensagemConfirmacao && (
        <div className="confirmation-message">
          <span>{mensagemConfirmacao}</span>
          <button className="close-confirmation" onClick={fecharMensagemConfirmacao}>
            <X size={16} />
          </button>
        </div>
      )}

      <button className="back-button-c">
        <img src={voltar} alt="Voltar" onClick={voltarPaginaAnterior} />
      </button>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => navegarEntreMeses(-1)} className="setaEsquerda">
            <ChevronLeft />
          </button>
          <h2>
            {mesAtual.nome} {anoAtual}
          </h2>
          <button onClick={() => navegarEntreMeses(1)} className="setadireita">
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((diaSemana) => (
            <div key={diaSemana}>{diaSemana}</div>
          ))}
        </div>

        <div className="days-grid">
          {diasDoCalendario.map((dia) => (
            <div
              key={dia.id}
              className={`day ${dia.estaIndisponivel ? "unavailable" : ""} ${dia.ehDataPassada ? "past-date" : ""}`}
              onClick={() => selecionarDia(dia)}
            >
              <span>{dia.dia}</span>
              {dia.consultasDoDia.map((consulta, indice) => (
                <div key={indice} className="appointment-detail">
                  {consulta}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg">
        <h1>Agenda de Consultas</h1>
        <img src={imgConsulta} alt="Imagem de consulta" />
      </div>

      {slotSelecionado.dia && (
        <div className="schedule">
          <button className="close-button" onClick={fecharPainelAgendamento}>
            <X size={24} />
          </button>
          <h1>
            Horários disponíveis para {slotSelecionado.dia} de {mesAtual.nome}
          </h1>

          <div className="form-group">
            <label>Convênio *</label>
            <select 
              value={convenioSelecionado}
              onChange={(e) => setConvenioSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione o convênio</option>
              <option value="Particular">Particular</option>
              <option value="Unimed">Unimed</option>
              <option value="Bradesco Saúde">Bradesco Saúde</option>
              <option value="SulAmérica">SulAmérica</option>
              <option value="Amil">Amil</option>
            </select>
          </div>

          <div className="form-group">
            <label>Procedimento *</label>
            <select
              value={procedimentoSelecionado}
              onChange={(e) => setProcedimentoSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione o procedimento</option>
              <option value="Consulta médica">Consulta médica</option>
              <option value="Acompanhamento">Acompanhamento</option>
              <option value="Retorno">Retorno</option>
            </select>
          </div>

          <h3>Horários *</h3>
          <div className="times">
            {horariosDisponiveis.map((horario) => {
              const estaAgendado = horariosAgendados.includes(horario);
              const horarioPassou = verificarSeHorarioPassou(
                anoAtual, 
                indiceMesAtual, 
                slotSelecionado.dia, 
                horario
              );

              return (
                <button
                  key={horario}
                  className={`time-button ${slotSelecionado.horario === horario ? "selected-time" : ""} ${horarioPassou ? "expired-time" : ""}`}
                  onClick={() => selecionarHorario(horario)}
                  disabled={estaAgendado || horarioPassou}
                  title={horarioPassou ? "Este horário já passou" : estaAgendado ? "Horário já agendado" : ""}
                >
                  {horario}
                  {horarioPassou && <span className="expired-badge"></span>}
                </button>
              );
            })}
          </div>

          <button
            className="confirm-button"
            onClick={confirmarAgendamento}
            disabled={!slotSelecionado.horario || !convenioSelecionado || !procedimentoSelecionado}
          >
            Confirmar agendamento
          </button>
        </div>
      )}
    </div>
  );
}

export default AgendaConsultas;