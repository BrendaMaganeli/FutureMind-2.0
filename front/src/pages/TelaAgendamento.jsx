import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CSS/TelaAgendamento.css"; 

export default function TelaAgendamento() {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { time: "09:00", patient: "João Silva" },
    { time: "11:00", patient: "Maria Oliveira" }
  ]);
  const [newPatient, setNewPatient] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleSchedule = () => {
    if (newPatient && newTime && !appointments.some(a => a.time === newTime)) {
      const newAppointment = { time: newTime, patient: newPatient };
      setAppointments([...appointments, newAppointment]);
      setNewPatient("");
      setNewTime("");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Agende sua Consulta</h1>
      <div className="content">
        <div className="calendar-container">
          <h2 className="section-title">Selecione uma Data</h2>
          <div className="calendar-wrapper">
            <Calendar 
              onChange={setDate} 
              value={date}
              tileDisabled={({ date, view }) => {
                if (view === 'month') {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }
                return false;
              }}
            />
          </div>
        </div>
        <div className="appointments-container">
          <h2 className="appointments-title">Consultas em {date.toLocaleDateString()}</h2>
          <div className="appointments-list">
            {appointments.map((appointment, index) => (
              <div key={index} className="appointment-item">
                <p className="patient-name">{appointment.patient}</p>
                <p className="appointment-time">{appointment.time}</p>
              </div>
            ))}
          </div>
          <div className="schedule-container">
            <h2 className="section-title">Marcar Consulta</h2>
            <input 
              type="text" 
              placeholder="Nome do Paciente" 
              value={newPatient} 
              onChange={(e) => setNewPatient(e.target.value)} 
              className="input-field" 
            />
            <input 
              type="time" 
              value={newTime} 
              onChange={(e) => setNewTime(e.target.value)} 
              className="input-field" 
            />
            <button onClick={handleSchedule} className="button">Agendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
