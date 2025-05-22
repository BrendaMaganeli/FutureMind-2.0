// src/pages/Consulta.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CSS/Consulta.css";
import imgConsulta from "../assets/Group 239294.svg";
import mulher from "../assets/image 8.png";
import voltar from "../assets/voltar 2.svg";

const getMonthData = (year) => {
  const isLeapYear =
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
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
    name: new Date(year, index).toLocaleString("pt-BR", { month: "long" }),
    days,
    start: new Date(year, index, 1).getDay(),
  }));
};

export default function Consulta() {
  const { id_paciente } = useParams();
  const navigate = useNavigate();
  const today = new Date();

  const [appointments, setAppointments] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());

  const [isEditing, setIsEditing] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState("");

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rescheduleMonthIndex, setRescheduleMonthIndex] = useState(
    today.getMonth()
  );
  const [rescheduleYear, setRescheduleYear] = useState(today.getFullYear());

  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    async function fetchConsultas() {
      try {
        const resp = await fetch(`/consulta/${id_paciente}`);
        if (!resp.ok) throw new Error("Falha ao buscar consultas");
        const data = await resp.json();
        const novoMapa = {};
        data.forEach((row) => {
          const dt = new Date(row.data);
          const y = dt.getFullYear();
          const m = dt.getMonth();
          const d = dt.getDate();
          const key = `${y}-${m}-${d}`;
          if (!novoMapa[key]) novoMapa[key] = [];
          novoMapa[key].push({
            id_consulta: row.id_consulta,
            time: row.hora,
            nome_profissional: row.nome_profissional,
          });
        });
        setAppointments(novoMapa);
      } catch (err) {
        console.error("Erro ao buscar agendamentos no React:", err);
      }
    }

    fetchConsultas();
  }, [id_paciente]);

  const months = getMonthData(currentYear);
  const month = months[currentMonthIndex];
  const prevMonth = months[(currentMonthIndex + 11) % 12];
  const days = Array.from({ length: 42 }, (_, i) => {
    let date,
      isCurrentMonth,
      isUnavailable,
      appointmentsForDay = [];

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
      isCurrentMonth = true;
      const key = `${currentYear}-${currentMonthIndex}-${date}`;
      appointmentsForDay = appointments[key] || [];
      isUnavailable = appointmentsForDay.length === 0;
    }

    return {
      id: i,
      date,
      isCurrentMonth,
      isUnavailable,
      appointmentsForDay,
    };
  });

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
    if (day.isCurrentMonth && day.appointmentsForDay.length > 0) {
      const agendamento = day.appointmentsForDay[0];
      setSelectedAppointment({
        day: day.date,
        month: currentMonthIndex,
        year: currentYear,
        ...agendamento,
      });
      setIsEditing(false);
      setNewTime("");
      setNewDate("");
    }
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setIsEditing(false);
    setNewTime("");
    setNewDate("");
  };

  const handleRemoveAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      const resp = await fetch(
        `/consulta/${selectedAppointment.id_consulta}`,
        {
          method: "DELETE",
        }
      );
      if (resp.status === 404) {
        alert("Consulta não encontrada no servidor");
        return;
      }
      if (!resp.ok) {
        throw new Error("Erro ao remover no back-end");
      }
      const key = `${selectedAppointment.year}-${selectedAppointment.month}-${selectedAppointment.day}`;
      setAppointments((prev) => {
        const novo = { ...prev };
        if (novo[key]) {
          novo[key] = novo[key].filter(
            (appt) => appt.id_consulta !== selectedAppointment.id_consulta
          );
          if (novo[key].length === 0) {
            delete novo[key];
          }
        }
        return novo;
      });
      handleClose();
    } catch (err) {
      console.error("Erro ao deletar agendamento:", err);
      alert("Não foi possível remover a consulta.");
    }
  };

  const handleConfirmUpdate = async () => {
    if (!selectedAppointment) return;

    const [diaStr, mesStr] = newDate.split("/");
    const dayNum = parseInt(diaStr, 10);
    const monthNum = currentMonthIndex;
    const yearNum = currentYear;
    const isoDate = `${yearNum}-${(monthNum + 1)
      .toString()
      .padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;

    const newTimeToSend = newTime; 

    try {
      const resp = await fetch(
        `/consulta/${selectedAppointment.id_consulta}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: isoDate, hora: newTimeToSend }),
        }
      );
      if (resp.status === 404) {
        alert("Consulta não encontrada no servidor");
        return;
      }
      if (!resp.ok) {
        throw new Error("Erro ao atualizar no back-end");
      }
      const oldKey = `${selectedAppointment.year}-${selectedAppointment.month}-${selectedAppointment.day}`;
      const newKey = `${yearNum}-${monthNum}-${dayNum}`;

      setAppointments((prev) => {
        const atualizado = { ...prev };
        if (atualizado[oldKey]) {
          atualizado[oldKey] = atualizado[oldKey].filter(
            (appt) => appt.id_consulta !== selectedAppointment.id_consulta
          );
          if (atualizado[oldKey].length === 0) {
            delete atualizado[oldKey];
          }
        }
        const novoObj = {
          id_consulta: selectedAppointment.id_consulta,
          time: newTimeToSend,
          nome_profissional: selectedAppointment.nome_profissional,
        };
        if (!atualizado[newKey]) {
          atualizado[newKey] = [novoObj];
        } else {
          atualizado[newKey].push(novoObj);
        }

        return atualizado;
      });

      setSelectedAppointment((prev) => ({
        ...prev,
        day: dayNum,
        month: monthNum,
        year: yearNum,
        time: newTimeToSend,
      }));

      setIsEditing(false);
      setNewTime("");
      setNewDate("");
      setShowRescheduleModal(false);

      setConfirmationMessage(
        `Consulta reagendada para ${dayNum} de ${getMonthName(
          monthNum
        )} às ${newTimeToSend}`
      );
    } catch (err) {
      console.error("Erro ao reagendar consulta:", err);
      alert("Não foi possível reagendar a consulta.");
    }
  };

  const getMonthName = (monthIndex) => {
    return new Date(2025, monthIndex).toLocaleString("pt-BR", {
      month: "long",
    });
  };

  const closeConfirmation = () => {
    setConfirmationMessage("");
  };

  return (
    <div className="container-agenda-c">
      {confirmationMessage && (
        <div className="confirmation-message-c">
          <span>{confirmationMessage}</span>
          <button
            className="close-confirmation-c"
            onClick={closeConfirmation}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <button className="back-button-c" onClick={() => navigate(-1)}>
        <img src={voltar} alt="Voltar" />
      </button>
      <div className="calendar-c">
        <div className="calendar-header-c">
          <button
            onClick={() => handleChangeMonth(-1)}
            className="setaEsquerda-c"
          >
            <ChevronLeft />
          </button>
          <h2>
            {month.name} {currentYear}
          </h2>
          <button
            onClick={() => handleChangeMonth(1)}
            className="setadireita-c"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays-c">
          {"Dom Seg Ter Qua Qui Sex Sab".split(" ").map((d) => (
            <div key={d}>{d}</div>
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
              {day.appointmentsForDay.map((appt, idx) => (
                <div key={idx} className="appointment-detail-c">
                  {appt.time}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg-c">
        <h1 className="agenda0104">Agenda de Consultas</h1>
        {!selectedAppointment ? (
          <img src={imgConsulta} alt="Sem seleção" />
        ) : (
          <div className="disabledimage"></div>
        )}
      </div>

      {selectedAppointment && (
        <div className="schedule-c">
          <button className="close-button-c" onClick={handleClose}>
            <X size={24} />
          </button>

          <div className="resumo-card-c">
            <div className="agendamento-info-c">
              <div className="profissional-c">
                <img
                  src={mulher}
                  alt="Foto do Profissional"
                  className="foto-profissional-c"
                />
                <div>
                  <h3>{selectedAppointment.nome_profissional}</h3>
                  <p>CRP 03/12345</p>
                  <p>Consulta Presencial</p>
                </div>
              </div>

              <div className="div-aux">
                <div className="detalhes-c">
                  <div>
                    <strong>Data:</strong> {selectedAppointment.day}/
                    {selectedAppointment.month + 1}/
                    {selectedAppointment.year}
                  </div>
                  <div>
                    <strong>Horário:</strong> {selectedAppointment.time}
                  </div>
                  <div className="valor-consulta-c">
                    <strong>Valor:</strong> R$ 165,00
                  </div>
                </div>

                <div className="botoes-c">
                  {isEditing ? (
                    <>
                      <select
                        className="select-data-c"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      >
                        <option value="">Selecione o dia</option>
                        {days
                          .filter((d) => d.isCurrentMonth && !d.isUnavailable)
                          .map((d) => (
                            <option
                              key={d.id}
                              value={`${d.date}/${currentMonthIndex + 1}`}
                            >
                              {d.date}/{currentMonthIndex + 1}
                            </option>
                          ))}
                      </select>

                      <select
                        className="select-horario-c"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      >
                        <option value="">Selecione um horário</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                      </select>

                      <button
                        className="confirmar-c"
                        onClick={handleConfirmUpdate}
                      >
                        Confirmar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="alterar-c"
                        onClick={() => setShowRescheduleModal(true)}
                      >
                        Alterar
                      </button>
                      <button
                        className="remover-c"
                        onClick={handleRemoveAppointment}
                      >
                        Remover
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && (
        <div className="reschedule-modal-overlay">
          <div className="reschedule-modal">
            <button
              className="modal-close-btn"
              onClick={() => setShowRescheduleModal(false)}
            >
              <X size={20} />
            </button>
            <h2>Reagendamento de consulta</h2>
            <p>Escolha o melhor dia e horário para reagendar sua consulta:</p>

            <div className="calendar-scroll">
              <div className="calendar-title">
                <button
                  onClick={() => {
                    let newM = rescheduleMonthIndex - 1;
                    let newY = rescheduleYear;
                    if (newM < 0) {
                      newM = 11;
                      newY -= 1;
                    }
                    setRescheduleMonthIndex(newM);
                    setRescheduleYear(newY);
                  }}
                  className="setaE-c"
                >
                  <ChevronLeft />
                </button>

                <h3>
                  {new Date(rescheduleYear, rescheduleMonthIndex).toLocaleString(
                    "pt-BR",
                    { month: "long", year: "numeric" }
                  )}
                </h3>

                <button
                  onClick={() => {
                    let newM = rescheduleMonthIndex + 1;
                    let newY = rescheduleYear;
                    if (newM > 11) {
                      newM = 0;
                      newY += 1;
                    }
                    setRescheduleMonthIndex(newM);
                    setRescheduleYear(newY);
                  }}
                  className="setaD-c"
                >
                  <ChevronRight />
                </button>
              </div>

              <div className="calendar-grid">
                {[
                  { day: "ter", date: "29 abr" },
                  { day: "qua", date: "30 abr" },
                  { day: "qui", date: "1 mai" },
                  { day: "sex", date: "2 mai" },
                  { day: "sáb", date: "3 mai" },
                  { day: "dom", date: "4 mai" },
                  { day: "seg", date: "5 mai" },
                ].map(({ day, date }, i) => (
                  <div key={i} className="calendar-day">
                    <strong>{day}</strong>
                    <span>{date}</span>
                    {["08:00", "09:00", "10:00", "11:00"].map((hour) => (
                      <button
                        key={hour}
                        className={`hour-btn ${
                          selectedDate === date && selectedTime === hour
                            ? "selected"
                            : ""
                        }`}
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
              <button
                className="btn-back"
                onClick={() => setShowRescheduleModal(false)}
              >
                Voltar
              </button>
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
