import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function TelaAgendamento() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [consultas, setConsultas] = useState([
    { horario: "09:00", paciente: "João Silva" },
    { horario: "11:00", paciente: "Maria Oliveira" },
  ]);
  const [novoPaciente, setNovoPaciente] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const horarios = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  // Dividir os horários em 4 fileiras
  const fileiras = [];
  for (let i = 0; i < 4; i++) {
    fileiras.push(horarios.slice(i * 4, (i + 1) * 4));
  }

  // Função para rolar os horários para a esquerda ou direita
  const scrollHorarios = (direction, index) => {
    const container = document.querySelector(`.horarios-container[data-index="${index}"]`);
    const scrollAmount = 200; // Quantidade de rolagem
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="container-agendamento">
      <div className="right-panel">
        <h1 className="title">Agende sua Consulta</h1>
        <div className="calendar-container">
          <h2 className="section-title">Selecione uma Data</h2>
          <Calendar
            onChange={setDataSelecionada}
            value={dataSelecionada}
            tileDisabled={({ date, view }) => {
              if (view === "month") {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                return date < hoje;
              }
              return false;
            }}
          />
        </div>
      </div>

      <div className="left-panel">
        <h2>Clínica</h2>
        <select className="dropdown">
          <option>Selecione a clínica</option>
        </select>

        <h2>Convênio</h2>
        <select className="dropdown">
          <option>Selecione o convênio</option>
        </select>

        <h2>Procedimento</h2>
        <select className="dropdown">
          <option>Selecione o procedimento</option>
        </select>

        <h2>Horários Disponíveis</h2>
        <div className="horarios-wrapper">
          {fileiras.map((fileira, index) => (
            <div key={index} className="fileira-container">
              <button
                className="scroll-button left"
                onClick={() => scrollHorarios("left", index)}
              >
                &#9664;
              </button>
              <div
                className="horarios-container"
                data-index={index}
              >
                {fileira.map((horario) => (
                  <button key={horario} className="horario-btn">
                    {horario}
                  </button>
                ))}
              </div>
              <button
                className="scroll-button right"
                onClick={() => scrollHorarios("right", index)}
              >
                &#9654;
              </button>
            </div>
          ))}
        </div>

        <button className="confirm-button">Confirmar Agendamento</button>
      </div>

      <style>{`
        .container-agendamento {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          min-height: 100vh;
          background-color: #cad7eb;
        }

        .left-panel,
        .right-panel {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .left-panel {
          width: 50%;
        }

        .right-panel {
          width: 50%;
        }

        .title {
          font-size: 2rem;
          font-weight: bold;
          color: #013a63;
        }

        .dropdown,
        .horario-btn,
        .confirm-button {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 8px;
          border: 1px solid #d1d5db;
        }

        .horarios-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .fileira-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .horarios-container {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 10px;
          width: 100%;
          padding-bottom: 10px;
        }

        .horarios-container::-webkit-scrollbar {
          display: none; /* Esconde a barra de rolagem */
        }

        .scroll-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #5a789f;
          flex-shrink: 0;
        }

        .scroll-button:hover {
          color: rgb(53, 95, 173);
        }

        .confirm-button {
          background-color: #5a789f;
          color: white;
          font-weight: bold;
          border: none;
        }

        .confirm-button:hover {
          background-color: rgb(53, 95, 173);
        }
      `}</style>
    </div>
  );
}
