import { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CSS/TelaAgendamento.css"; // Importando o CSS separado

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedConvenio, setSelectedConvenio] = useState("");
  const [selectedProcedimento, setSelectedProcedimento] = useState("");
  const horarios = [
    "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30",
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30"
  ];

  return (
    <div className="appointment-container">
      {/* Lado Esquerdo: Calendário */}
      <div className="calendar-container">
        <h2 className="calendar-title">Selecione uma Data</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="custom-calendar"
        />
      </div>

      {/* Lado Direito: Informações */}
      <div className="info-container">
        <div className="info-content">
          {/* Select para Convênio */}
          <div className="select-group">
            <label htmlFor="convenio">Selecione o convênio:</label>
            <select
              id="convenio"
              value={selectedConvenio}
              onChange={(e) => setSelectedConvenio(e.target.value)}
              className="select-input"
            >
              <option value="">Selecione...</option>
              <option value="convenio1">Convênio 1</option>
              <option value="convenio2">Convênio 2</option>
            </select>
          </div>

          {/* Select para Procedimento */}
          <div className="select-group">
            <label htmlFor="procedimento">Selecione o procedimento:</label>
            <select
              id="procedimento"
              value={selectedProcedimento}
              onChange={(e) => setSelectedProcedimento(e.target.value)}
              className="select-input"
            >
              <option value="">Selecione...</option>
              <option value="proc1">Procedimento 1</option>
              <option value="proc2">Procedimento 2</option>
            </select>
          </div>

          {/* Horários Disponíveis */}
          <h3 className="available-times-title">Horários Disponíveis</h3>
          <div className="times-grid">
            {horarios.map((horario) => (
              <button key={horario} className="time-button">
                {horario}
              </button>
            ))}
          </div>

          {/* Botão de Confirmação */}
          <button className="confirm-button">Confirmar Agendamento</button>
        </div>
      </div>
    </div>
  );
}