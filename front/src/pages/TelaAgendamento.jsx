import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react";
import "./CSS/TelaAgendamento.css";
import imgConsulta from '../assets/Group 239294.svg';

const getMonthData = (year) => {
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth.map((days, index) => ({
    name: new Date(year, index).toLocaleString("default", { month: "long" }),
    days,
    start: (new Date(year, index, 1).getDay() + 1) % 7,
  }));
};

export default function AgendaConsultas() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [appointments, setAppointments] = useState({});

  const months = getMonthData(currentYear);

  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonthIndex === 0) setCurrentYear((year) => year - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonthIndex === 11) setCurrentYear((year) => year + 1);
  };

  const handleDayClick = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day.date);
      setSelectedTime(null);
      setConfirmationMessage("");
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleClose = () => {
    setSelectedDay(null);
    setSelectedTime(null);
    setConfirmationMessage("");
  };

  const handleConfirm = () => {
    if (selectedDay && selectedTime) {
      setAppointments((prev) => {
        const key = `${currentYear}-${currentMonthIndex}-${selectedDay}`;
        return { ...prev, [key]: [...(prev[key] || []), selectedTime] };
      });
      setConfirmationMessage(`Consulta agendada para ${selectedDay} de ${months[currentMonthIndex].name} às ${selectedTime}`);
    }
  };

  const handleClearMessage = () => {
    setConfirmationMessage("");
  };

  const month = months[currentMonthIndex];
  const prevMonth = months[(currentMonthIndex + 11) % 12];

  const days = [];
  for (let i = 0; i < 42; i++) {
    let date = null;
    let isCurrentMonth = true;
    let isSunday = i % 7 === 0;
    let isUnavailable = false;
    let hasAppointments = false;

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
      hasAppointments = appointments[key]?.length > 0;
    }

    days.push({ id: i, date, isCurrentMonth, isSunday, isUnavailable, hasAppointments });
  }

  return (
    <div className="container-agenda">
      <button className="back-button" onClick={() => window.history.back()}>
        <ArrowLeft size={24} />
      </button>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePreviousMonth} className="setaEsquerda">
            <ChevronLeft />
          </button>
          <h2>{month.name} {currentYear}</h2>
          <button onClick={handleNextMonth} className="setadireita">
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays">
          {"Dom Seg Ter Qua Qui Sex Sab".split(" ").map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="days-grid">
          {days.map((day) => (
            <div
              key={day.id}
              className={`day ${day.isSunday ? "sunday" : ""} ${day.isUnavailable ? "unavailable" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <span>{day.date}</span>
              {day.hasAppointments && <div className="appointment-indicator">●</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg">
        <h1>Agenda de Consultas</h1>
        <img src={imgConsulta} alt="" />
      </div>

      {selectedDay && (
        <div className="schedule">
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
          <h1>Horários disponíveis para {selectedDay} de {month.name}</h1>

          <div className="form-group">
            <label>Convênio</label>
            <select>
              <option>Selecione o convênio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Procedimento</label>
            <select>
              <option>Selecione o procedimento</option>
            </select>
          </div>

          <h3>Horários</h3>
          <div className="times">
            {["14:30", "17:30", "13:00", "16:10", "11:00", "19:20", "13:30"].map((time) => (
              <button key={time} className={`time-button ${selectedTime === time ? "selected-time" : ""}`} onClick={() => handleTimeClick(time)}>{time}</button>
            ))}
          </div>

          <button className="confirm-button" onClick={handleConfirm} disabled={!selectedTime}>Confirmar agendamento</button>
        </div>
      )}
    </div>
  );
}
