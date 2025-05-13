import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/TelaAgendamento.css";
import imgConsulta from '../assets/Group 239294.svg';
import voltar from '../assets/seta-principal.svg';

const getMonthData = (year) => {
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
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
  const [selected, setSelected] = useState({
    day: null,
    time: null,
    message: "",
  });
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [appointments, setAppointments] = useState({});

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
    if (day.isCurrentMonth && !day.isUnavailable) {
      setSelected({ day: day.date, time: null });
    }
  };

  const handleTimeClick = (time) => {
    const key = `${currentYear}-${currentMonthIndex}-${selected.day}`;
    if (!appointments[key]) {
      setSelected((prev) => ({ ...prev, time }));
    }
  };

  const handleClose = () => {
    setSelected({ day: null, time: null });
  };

  const handleConfirm = () => {
    if (selected.day && selected.time) {
      const key = `${currentYear}-${currentMonthIndex}-${selected.day}`;
      if (!appointments[key]) {
        setAppointments((prev) => ({ ...prev, [key]: [selected.time] }));
        setConfirmationMessage(
          `Consulta agendada para ${selected.day} de ${months[currentMonthIndex].name} às ${selected.time}`,
        );
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

  return (
    <div className="container-agenda">
      {confirmationMessage && (
        <div className="confirmation-message">
          <span>{confirmationMessage}</span>
          <button className="close-confirmation" onClick={closeConfirmation}>
            <X size={16} />
          </button>
        </div>
      )}
      <button className="back-button-c" >
      <img src={voltar} alt="" />
      </button>

      <div className="calendar">
        <div className="calendar-header">
          <button
            onClick={() => handleChangeMonth(-1)}
            className="setaEsquerda"
          >
            <ChevronLeft />
          </button>
          <h2>
            {month.name} {currentYear}
          </h2>
          <button onClick={() => handleChangeMonth(1)} className="setadireita">
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
              className={`day ${day.isUnavailable ? "unavailable" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <span>{day.date}</span>
              {day.appointmentsForDay.map((appt, index) => (
                <div key={index} className="appointment-detail">
                  {appt}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg">
        <h1>Agenda de Consultas</h1>
        <img src={imgConsulta} alt="" />
      </div>

      {selected.day && (
        <div className="schedule">
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
          <h1>
            Horários disponíveis para {selected.day} de {month.name}
          </h1>

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
            {[
              "14:30",
              "17:30",
              "13:00",
              "16:10",
              "11:00",
              "19:20",
              "13:30",
            ].map((time) => (
              <button
                key={time}
                className={`time-button ${selected.time === time ? "selected-time" : ""}`}
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!selected.time}
          >
            Confirmar agendamento
          </button>
        </div>
      )}
    </div>
  );
}
