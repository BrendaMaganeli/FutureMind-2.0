import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CSS/TelaAgendamento.css"; 

export default function TelaAgendamento() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [consultas, setConsultas] = useState([
    { horario: "09:00", paciente: "João Silva" },
    { horario: "11:00", paciente: "Maria Oliveira" }
  ]);
  const [novoPaciente, setNovoPaciente] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const horarioDisponivel = (horario) => {
    return !consultas.some(c => c.horario === horario || (parseInt(horario.split(":")[0]) < parseInt(c.horario.split(":")[0]) + 1 && parseInt(horario.split(":")[0]) >= parseInt(c.horario.split(":")[0])));
  };

  const fecharMensagemErro = () => {
    setMensagemErro("");
  };

  const agendarConsulta = () => {
    if (novoPaciente && novoHorario) {
      if (horarioDisponivel(novoHorario)) {
        const novaConsulta = { horario: novoHorario, paciente: novoPaciente };
        setConsultas([...consultas, novaConsulta]);
        setNovoPaciente("");
        setNovoHorario("");
      } else {
        setMensagemErro("Horário indisponível. Por favor, escolha outro horário.");
        setTimeout(() => setMensagemErro(""), 2000);
      }
    }
  };

  return (
    <div className="container-agendamento">
      <div className="back-arrow">
        <span>&lt;</span> 
    </div>
      <h1 className="title">Agende sua Consulta</h1>
      <div className="content">
        <div className="calendar-container">
          <h2 className="section-title">Selecione uma Data</h2>
          <div className="calendar-wrapper">
            <Calendar 
              onChange={setDataSelecionada} 
              value={dataSelecionada}
              tileDisabled={({ date, view }) => {
                if (view === 'month') {
                  const hoje = new Date();
                  hoje.setHours(0, 0, 0, 0);
                  return date < hoje;
                }
                return false;
              }}
            />
          </div>
        </div>
        <div className="left-panel">
        
        <h2>Convênio</h2>
        <select className="dropdown">
          <option>Selecione o convênio</option>
        </select>

        <h2>Procedimento</h2>
        <select className="dropdown">
          <option>Selecione o procedimento</option>
        </select>

        <h2>Horários Disponíveis</h2>
        <div className="horarios-container">
          {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"].map((horario) => (
            <button key={horario} className="horario-btn">{horario}</button>
          ))}
        </div>

        <button className="confirm-button">Confirmar Agendamento</button>
      </div>
      </div>
    </div>
  );
}
