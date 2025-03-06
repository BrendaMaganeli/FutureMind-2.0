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
    <div className="container">
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
        <div className="appointments-container">
          <h2 className="appointments-title">Consultas em {dataSelecionada.toLocaleDateString()}</h2>
          <div className="appointments-list">
            {consultas.map((consulta, index) => (
              <div key={index} className="appointment-item">
                <p className="patient-name">{consulta.paciente}</p>
                <p className="appointment-time">{consulta.horario}</p>
              </div>
            ))}
          </div>
          <div className="schedule-container">
            <h2 className="section-title">Marcar Consulta</h2>
            {mensagemErro && (
              <div className="error-message floating">
                <span>{mensagemErro}</span>
                <button className="close-button" onClick={fecharMensagemErro}>X</button>
              </div>
            )}
            <input 
              type="text" 
              placeholder="Nome do Paciente" 
              value={novoPaciente} 
              onChange={(e) => setNovoPaciente(e.target.value)} 
              className="input-field" 
            />
            <input 
              type="time" 
              value={novoHorario} 
              onChange={(e) => setNovoHorario(e.target.value)} 
              className="input-field" 
            />
            <button onClick={agendarConsulta} className="button">Agendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
