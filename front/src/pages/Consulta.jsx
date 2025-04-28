import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react";
import "./CSS/Consulta.css";
import imgConsulta from '../assets/Group 239294.svg';
import mulher from '../assets/image 8.png';

const getMonthData = (year) => {
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth.map((days, index) => ({
    name: new Date(year, index).toLocaleString("default", { month: "long" }),
    days,
    start: new Date(year, index, 1).getDay(),
  }));
};

export default function AgendaConsultas() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [selected, setSelected] = useState({ day: null, time: null, message: "" });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // --- Fictício: uma consulta já marcada ---
  const initialAppointments = {
    [`${today.getFullYear()}-${today.getMonth()}-15`]: [{ 
      time: "14:00", 
      paciente: "João Silva", 
      motivo: "Consulta de rotina" 
    }],
  };
  const [appointments, setAppointments] = useState(initialAppointments);
  // -----------------------------------------

  const months = getMonthData(currentYear);

  const handleChangeMonth = (direction) => {
    setCurrentMonthIndex((prev) => {
      let newMonth = prev + direction;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const handleDayClick = (day) => {
    if (day.isCurrentMonth) {
      setSelected({ day: day.date, time: null });
    }
  };

  const handleClose = () => {
    setSelected({ day: null, time: null });
  };

  const handleConfirm = () => {
    if (selected.day && selected.time) {
      const key = `${currentYear}-${currentMonthIndex}-${selected.day}`;
      if (!appointments[key]) {
        setAppointments((prev) => ({ 
          ...prev, 
          [key]: [{ time: selected.time, paciente: "Novo Paciente", motivo: "Motivo da consulta" }]
        }));
        setConfirmationMessage(`Consulta agendada para ${selected.day} de ${months[currentMonthIndex].name} às ${selected.time}`);
      }
    }
  };

  const closeConfirmation = () => {
    setConfirmationMessage("");
  };

  const month = months[currentMonthIndex];
  const prevMonth = months[(currentMonthIndex + 11) % 12];

  const days = Array.from({ length: 42 }, (_, i) => {
    let date = null;
    let isCurrentMonth = true;
    let isUnavailable = false;
    let appointmentsForDay = [];

    if (i < month.start) {
      date = prevMonth.days - (month.start - i - 1);
      isCurrentMonth = false;
      isUnavailable = true;
    } else if (i >= month.start + month.days) {
      date = i - (month.start + month.days) + 1;
      isCurrentMonth = false;
      isUnavailable = true;
    } else {
      date = i - month.start + 1;
      const key = `${currentYear}-${currentMonthIndex}-${date}`;
      appointmentsForDay = appointments[key] || [];
      isUnavailable = appointmentsForDay.length > 0;
    }

    return { id: i, date, isCurrentMonth, isUnavailable, appointmentsForDay };
  });

  const selectedDayAppointments = selected.day
    ? appointments[`${currentYear}-${currentMonthIndex}-${selected.day}`] || []
    : [];

  return (
    <div className="container-agenda-c">
      {confirmationMessage && (
        <div className="confirmation-message-c">
          <span>{confirmationMessage}</span>
          <button className="close-confirmation-c" onClick={closeConfirmation}>
            <X size={16} />
          </button>
        </div>
      )}
      <button className="back-button-c" onClick={() => window.history.back()}>
        <ArrowLeft size={24} />
      </button>

      <div className="calendar-c">
        <div className="calendar-header-c">
          <button onClick={() => handleChangeMonth(-1)} className="setaEsquerda-c">
            <ChevronLeft />
          </button>
          <h2>{month.name} {currentYear}</h2>
          <button onClick={() => handleChangeMonth(1)} className="setadireita-c">
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays-c">
          {"Dom Seg Ter Qua Qui Sex Sab".split(" ").map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="days-grid-c">
          {days.map((day) => (
            <div
              key={day.id}
              className={`day ${day.isUnavailable ? "unavailable" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <span>{day.date}</span>
              {day.appointmentsForDay.map((appt, index) => (
                <div key={index} className="appointment-detail-c">{appt.time}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg-c">
        <h1>Agenda de Consultas</h1>
        <img src={imgConsulta} alt="" />
      </div>

      {selected.day && (
  <div className="schedule-c">
    <button className="close-button-c" onClick={handleClose}>
      <X size={24} />
    </button>

    <div className="resumo-card-c">
      <h2>Resumo</h2>

      <div className="agendamento-info-c">
        <div className="profissional-c">
          <img src={mulher} alt="Foto do Profissional" className="foto-profissional-c" />
          <div>
            <h3>Dra. Maria Souza</h3>
            <p>CRP 03/12345</p>
            <p>Consulta Presencial</p>
          </div>
        </div>

        <div className="detalhes-c">
          <div>
            <strong>Data:</strong> {selected.day}/{currentMonthIndex + 1}/{currentYear}
          </div>
          <div>
            <strong>Horário:</strong> {selected.time}
          </div>
          <div className="valor-consulta-c">
            <strong>Valor:</strong> R$ 165,00
          </div>
        </div>

        <div className="botoes-c">
          <button className="alterar-c">Alterar</button>
          <button className="remover-c">Remover</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
