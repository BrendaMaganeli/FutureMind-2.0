import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./CSS/TelaAgendamento.css";
import imgConsulta from "../assets/Group 239294.svg";
import voltar from "../assets/seta-principal.svg";

const calcularDadosDoMes = (ano) => {
  const isLeapYear = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0);
  
  return [
    31, isLeapYear ? 29 : 28, 31, 30, 31, 30,
    31, 31, 30, 31, 30, 31
  ].map((dias, monthIndex) => ({
    nome: new Date(ano, monthIndex).toLocaleString("default", { month: "long" }),
    dias,
    inicio: new Date(ano, monthIndex, 1).getDay(),
  }));
};

const isHorarioPassado = (year, month, day, time) => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const appointmentDate = new Date(year, month, day, hours, minutes);
  return appointmentDate < now;
};

const isDataPassada = (year, month, day) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
};

function AgendaConsultas() {
  const today = new Date();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [appointments, setAppointments] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({ day: null, time: null });
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");

  const monthsData = calcularDadosDoMes(currentYear);
  const currentMonth = monthsData[currentMonthIndex];
  const previousMonth = monthsData[(currentMonthIndex + 11) % 12];
  const appointmentKey = `${currentYear}-${currentMonthIndex}-${selectedSlot.day}`;
  const bookedTimes = appointments[appointmentKey] || [];

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    let day, isCurrentMonth = true, isUnavailable = false, 
        isPastDate = false, dayAppointments = [];

    if (index < currentMonth.inicio) {
      day = previousMonth.dias - (currentMonth.inicio - index - 1);
      isCurrentMonth = false;
      isUnavailable = true;
    } 
    else if (index >= currentMonth.inicio + currentMonth.dias) {
      day = index - (currentMonth.inicio + currentMonth.dias) + 1;
      isCurrentMonth = false;
      isUnavailable = true;
    } 
    else {
      day = index - currentMonth.inicio + 1;
      const dayKey = `${currentYear}-${currentMonthIndex}-${day}`;
      dayAppointments = appointments[dayKey] || [];
      isPastDate = isDataPassada(currentYear, currentMonthIndex, day);
      isUnavailable = dayAppointments.length > 0 || isPastDate;
    }

    return { 
      id: index, 
      day, 
      isCurrentMonth, 
      isUnavailable, 
      isPastDate,
      appointments: dayAppointments 
    };
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const sqlMonth = currentMonthIndex + 1;
        const response = await fetch(
          `http://localhost:4242/agendamento/${id}/${currentYear}/${sqlMonth}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch appointments");
        
        const data = await response.json();
        const appointmentsMap = data.reduce((acc, appointment) => {
          const day = new Date(appointment.data).getDate();
          const key = `${currentYear}-${currentMonthIndex}-${day}`;
          acc[key] = acc[key] || [];
          acc[key].push(appointment.hora);
          return acc;
        }, {});
        
        setAppointments(appointmentsMap);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [currentYear, currentMonthIndex, id]);

  const navigateMonths = (direction) => {
    setCurrentMonthIndex((prevMonth) => {
      let newMonth = prevMonth + direction;
      let newYear = currentYear;
      
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const selectDay = (day) => {
    if (day.isCurrentMonth && !day.isPastDate) {
      setSelectedSlot({ day: day.day, time: null });
      setSelectedInsurance("");
      setSelectedProcedure("");
    }
  };

  const selectTime = (time) => {
    const isTimePassed = isHorarioPassado(
      currentYear, 
      currentMonthIndex, 
      selectedSlot.day, 
      time
    );

    if (!bookedTimes.includes(time) && !isTimePassed) {
      setSelectedSlot(prev => ({ ...prev, time }));
    }
  };

  const confirmAppointment = () => {
    if (!selectedSlot.time || !selectedInsurance || !selectedProcedure) {
      setConfirmationMessage("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(selectedSlot.day).padStart(2, "0")}`;
    
    navigate(`/pagamento/${id}?vim_agendamento=true`, {
      state: { 
        date: formattedDate, 
        time: selectedSlot.time,
        convenio: selectedInsurance,
        procedimento: selectedProcedure 
      },
    });
  };

  const closeAppointmentPanel = () => setSelectedSlot({ day: null, time: null });
  const closeConfirmationMessage = () => setConfirmationMessage("");
  const goBack = () => navigate(-1);

  const availableTimes = [
    "14:30", "17:30", "13:00", 
    "16:10", "11:00", "19:20", "13:30"
  ];

  return (
    <div className="container-agenda">
      {confirmationMessage && (
        <div className="confirmation-message">
          <span>{confirmationMessage}</span>
          <button className="close-confirmation" onClick={closeConfirmationMessage}>
            <X size={16} />
          </button>
        </div>
      )}

      <button className="back-button-c">
        <img src={voltar} alt="Voltar" onClick={goBack} />
      </button>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => navigateMonths(-1)} className="setaEsquerda">
            <ChevronLeft />
          </button>
          <h2>{currentMonth.nome} {currentYear}</h2>
          <button onClick={() => navigateMonths(1)} className="setadireita">
            <ChevronRight />
          </button>
        </div>

        <div className="weekdays">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((weekday) => (
            <div key={weekday}>{weekday}</div>
          ))}
        </div>

        <div className="days-grid">
          {calendarDays.map((day) => (
            <div
              key={day.id}
              className={`day ${day.isUnavailable ? "unavailable" : ""} ${day.isPastDate ? "past-date" : ""}`}
              onClick={() => selectDay(day)}
            >
              <span>{day.day}</span>
              {day.appointments.map((appointment, index) => (
                <div key={index} className="appointment-detail">
                  {appointment}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="divimg">
        <h1>Agenda de Consultas</h1>
        <img src={imgConsulta} alt="Imagem de consulta" />
      </div>

      {selectedSlot.day && (
        <div className="schedule">
          <button className="close-button" onClick={closeAppointmentPanel}>
            <X size={24} />
          </button>
          <h1>Horários disponíveis para {selectedSlot.day} de {currentMonth.nome}</h1>

          <div className="form-group">
            <label>Convênio *</label>
            <select 
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              required
            >
              <option value="">Selecione o convênio</option>
              <option value="Particular">Particular</option>
              <option value="Unimed">Unimed</option>
              <option value="Bradesco Saúde">Bradesco Saúde</option>
              <option value="SulAmérica">SulAmérica</option>
              <option value="Amil">Amil</option>
            </select>
          </div>

          <div className="form-group">
            <label>Procedimento *</label>
            <select
              value={selectedProcedure}
              onChange={(e) => setSelectedProcedure(e.target.value)}
              required
            >
              <option value="">Selecione o procedimento</option>
              <option value="Consulta médica">Consulta médica</option>
              <option value="Acompanhamento">Acompanhamento</option>
              <option value="Retorno">Retorno</option>
            </select>
          </div>

          <h3>Horários *</h3>
          <div className="times">
            {availableTimes.map((time) => {
              const isBooked = bookedTimes.includes(time);
              const isTimePassed = isHorarioPassado(
                currentYear, 
                currentMonthIndex, 
                selectedSlot.day, 
                time
              );

              return (
                <button
                  key={time}
                  className={`time-button ${selectedSlot.time === time ? "selected-time" : ""} ${isTimePassed ? "expired-time" : ""}`}
                  onClick={() => selectTime(time)}
                  disabled={isBooked || isTimePassed}
                  title={isTimePassed ? "Este horário já passou" : isBooked ? "Horário já agendado" : ""}
                >
                  {time}
                  {isTimePassed && <span className="expired-badge"></span>}
                </button>
              );
            })}
          </div>

          <button
            className="confirm-button"
            onClick={confirmAppointment}
            disabled={!selectedSlot.time || !selectedInsurance || !selectedProcedure}
          >
            Confirmar agendamento
          </button>
        </div>
      )}
    </div>
  );
}

export default AgendaConsultas;