import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/Telaagendamento.css";
import imgConsulta from '../assets/Group 239294.svg';
import voltar from '../assets/seta-principal.svg';
import cors from 'cors';
import { useParams } from "react-router-dom";

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
  const [appointments, setAppointments] = useState({});
  const [selected, setSelected] = useState({ day: null, time: null });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const months = getMonthData(currentYear);
  const month = months[currentMonthIndex];
  const prevMonth = months[(currentMonthIndex + 11) % 12];
  const days = Array.from({ length: 42 }, (_, i) => {
    let date, isCurrentMonth = true, isUnavailable = false, appointmentsForDay = [];

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

  const { id } = useParams()
  const user = JSON.parse(localStorage.getItem('User-Profile'));

  useEffect(() => {
    const year = currentYear;
    const monthSQL = currentMonthIndex + 1; // 0–11 → 1–12

    fetch(`http://localhost:4242/agendamento/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar agendamento");
        return res.json();
      })
      .then(data => {
        const map = {};
        data.forEach(a => {
          const day = new Date(a.data).getDate();
          map[`${year}-${currentMonthIndex}-${day}`] = [a.hora];
        });
        setAppointments(map);
      })
      .catch(err => console.error(err));
  }, [currentYear, currentMonthIndex]);

  function handleChangeMonth(direction) {
    setCurrentMonthIndex(prev => {
      let newMonth = prev + direction;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11; newYear--;
      } else if (newMonth > 11) {
        newMonth = 0; newYear++;
      }
      setCurrentYear(newYear);
      return newMonth;
    });
  }

  function handleDayClick(day) {
    if (day.isCurrentMonth && !day.isUnavailable) {
      setSelected({ day: day.date, time: null });
    }
  }

  function handleTimeClick(time) {
    const key = `${currentYear}-${currentMonthIndex}-${selected.day}`;
    if (!appointments[key]) {
      setSelected(prev => ({ ...prev, time }));
    }
  }

  function handleConfirm() {
    if (!selected.day || !selected.time) return;

    const dateISO = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(selected.day).padStart(2, "0")}`;
    const payload = {
      id_paciente: user.id_paciente,
      data: dateISO,
      hora: selected.time
    };

    fetch(`http://localhost:4242/agendamento/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Falha ao agendar");
        return res.json();
      })
      .then(() => {
        const key = `${currentYear}-${currentMonthIndex}-${selected.day}`;
        setAppointments(prev => ({ ...prev, [key]: [selected.time] }));
        setConfirmationMessage(
          `Consulta agendada para ${selected.day} de ${month.name} às ${selected.time}`
        );
      })
      .catch(err => {
        console.error(err);
        alert("Não foi possível agendar a consulta.");
      });
  }

  function handleClose() {
    setSelected({ day: null, time: null });
  }

  function closeConfirmation() {
    setConfirmationMessage("");
  }

  // 5) JSX
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

      <button className="back-button-c">
        <img src={voltar} alt="Voltar" />
      </button>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => handleChangeMonth(-1)} className="setaEsquerda">
            <ChevronLeft />
          </button>
          <h2>{month.name} {currentYear}</h2>
          <button onClick={() => handleChangeMonth(1)} className="setadireita">
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays">
          {"Dom Seg Ter Qua Qui Sex Sab".split(" ").map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="days-grid">
          {days.map(day => (
            <div
              key={day.id}
              className={`day ${day.isUnavailable ? "unavailable" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <span>{day.date}</span>
              {day.appointmentsForDay.map((appt, i) => (
                <div key={i} className="appointment-detail">{appt}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg">
        <h1>Agenda de Consultas</h1>
        <img src={imgConsulta} alt="Imagem de consulta" />
      </div>

      {selected.day && (
        <div className="schedule">
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
          <h1>Horários disponíveis para {selected.day} de {month.name}</h1>

          <div className="form-group">
            <label>Convênio</label>
            <select><option>Selecione o convênio</option></select>
          </div>

          <div className="form-group">
            <label>Procedimento</label>
            <select><option>Selecione o procedimento</option></select>
          </div>

          <h3>Horários</h3>
          <div className="times">
            {["14:30", "17:30", "13:00", "16:10", "11:00", "19:20", "13:30"].map(time => (
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
