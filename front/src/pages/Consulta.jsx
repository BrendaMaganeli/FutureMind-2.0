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
  const [selected, setSelected] = useState({ day: null, time: null });
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState("");

  const initialAppointments = {
    [`${today.getFullYear()}-${today.getMonth()}-15`]: [{
      time: "14:00",
      paciente: "João Silva",
      motivo: "Consulta de rotina"
    }],
  };
  const [appointments, setAppointments] = useState(initialAppointments);

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
    if (day.isCurrentMonth && !day.isUnavailable && day.appointmentsForDay.length > 0) {
      setSelected({ day: day.date, time: day.appointmentsForDay[0].time });
      setIsEditing(false);
      setNewTime("");
      setNewDate("");
    }
  };

  const handleClose = () => {
    setSelected({ day: null, time: null });
    setIsEditing(false);
    setNewTime("");
    setNewDate("");
  };

  const handleRemoveAppointment = () => {
    const key = `${currentYear}-${currentMonthIndex}-${selected.day}`;
    setAppointments((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    handleClose();
  };

  const handleConfirmUpdate = () => {
    const oldKey = `${currentYear}-${currentMonthIndex}-${selected.day}`;
  
    let newDay = selected.day;
    let newMonth = currentMonthIndex;
    let newYear = currentYear;
  
    if (selectedDate) {
      const [dayStr, monthStr] = selectedDate.split(" ");
      const day = parseInt(dayStr);
      const monthMap = {
        jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
        jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
      };
      newDay = day;
      newMonth = monthMap[monthStr.toLowerCase()];
    }
  
    const finalTime = newTime || selectedTime;
  
    const newKey = `${currentYear}-${newMonth}-${newDay}`;
  
    setAppointments((prev) => {
      const updated = { ...prev };
      delete updated[oldKey];
      updated[newKey] = [{ ...prev[oldKey][0], time: finalTime }];
      return updated;
    });
  
    // Atualiza seleção
    setSelected({ day: newDay, time: finalTime });
    setCurrentMonthIndex(newMonth);
    setCurrentYear(newYear);
  
    // Limpa estados
    setIsEditing(false);
    setNewTime("");
    setNewDate("");
    setSelectedDate(null);
    setSelectedTime(null);
    setShowRescheduleModal(false);
  
    setConfirmationMessage(
      `Consulta reagendada para ${newDay} de ${getMonthName(newMonth)} às ${finalTime}`
    );
  };
  
  // Função auxiliar para nome do mês por extenso (em português)
  const getMonthName = (monthIndex) => {
    return new Date(2025, monthIndex).toLocaleString("pt-BR", { month: "long" });
  };
  
  
  const extractDayAndMonth = (str) => {
    const [dayStr, monthStr] = str.split(" ");
    const day = parseInt(dayStr);
    const monthMap = {
      jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
      jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
    };
    const month = monthMap[monthStr.toLowerCase()];
    return { day, month };
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
      isUnavailable = appointmentsForDay.length === 0;
    }

    return { id: i, date, isCurrentMonth, isUnavailable, appointmentsForDay };
  });

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rescheduleMonthIndex, setRescheduleMonthIndex] = useState(today.getMonth());
  const [rescheduleYear, setRescheduleYear] = useState(today.getFullYear());

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

      {selected.day && selected.time && (
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
                <div><strong>Data:</strong> {selected.day}/{currentMonthIndex + 1}/{currentYear}</div>
                <div><strong>Horário:</strong> {selected.time}</div>
                <div className="valor-consulta-c"><strong>Valor:</strong> R$ 165,00</div>
              </div>

              <div className="botoes-c">
                {isEditing ? (
                  <>
                    <select className="select-data-c" value={newDate} onChange={(e) => setNewDate(e.target.value)}>
                      <option value="">Selecione o dia</option>
                      {days.filter((d) => d.isCurrentMonth && !d.isUnavailable).map((d) => (
                        <option key={d.id} value={d.date}>{d.date}/{currentMonthIndex + 1}</option>
                      ))}
                    </select>

                    <select className="select-horario-c" value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                      <option value="">Selecione um horário</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                    </select>

                    <button className="confirmar-c" onClick={handleConfirmUpdate}>Confirmar</button>
                  </>
                ) : (
                  <>
                    <button className="alterar-c" onClick={() => setShowRescheduleModal(true)}>Alterar</button>
                    <button className="remover-c" onClick={handleRemoveAppointment}>Remover</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && (
        <div className="reschedule-modal-overlay">
          <div className="reschedule-modal">
            <button className="modal-close-btn" onClick={() => setShowRescheduleModal(false)}>
              <X size={20} />
            </button>
            <h2>Reagendamento de consulta</h2>
            <p>Escolha o melhor dia e horário para reagendar sua consulta:</p>

            <div className="calendar-scroll">
              <div className="calendar-title">
                <button onClick={() => {
                  let newMonth = rescheduleMonthIndex - 1;
                  let newYear = rescheduleYear;
                  if (newMonth < 0) {
                    newMonth = 11;
                    newYear -= 1;
                  }
                  setRescheduleMonthIndex(newMonth);
                  setRescheduleYear(newYear);
                }} className="setaE-c"><ChevronLeft /></button>

                <h3>{new Date(rescheduleYear, rescheduleMonthIndex).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>

                <button onClick={() => {
                  let newMonth = rescheduleMonthIndex + 1;
                  let newYear = rescheduleYear;
                  if (newMonth > 11) {
                    newMonth = 0;
                    newYear += 1;
                  }
                  setRescheduleMonthIndex(newMonth);
                  setRescheduleYear(newYear);
                }} className="setaD-c"><ChevronRight /></button>
              </div>

              <div className="calendar-grid">
                {[{ day: 'ter', date: '29 abr' }, { day: 'qua', date: '30 abr' }, { day: 'qui', date: '1 mai' }, { day: 'sex', date: '2 mai' }, { day: 'sáb', date: '3 mai' }, { day: 'dom', date: '4 mai' }, { day: 'seg', date: '5 mai' }].map(({ day, date }, i) => (
                  <div key={i} className="calendar-day">
                    <strong>{day}</strong>
                    <span>{date}</span>
                    {['08:00', '09:00', '10:00', '11:00'].map((hour) => (
                      <button
                        key={hour}
                        className={`hour-btn ${selectedDate === date && selectedTime === hour ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(hour);
                        }}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-back" onClick={() => setShowRescheduleModal(false)}>Voltar</button>
              <button
                className="btn-confirm"
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                  handleConfirmUpdate();
                  setShowRescheduleModal(false);
                }}
              >
                Reagendar consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
