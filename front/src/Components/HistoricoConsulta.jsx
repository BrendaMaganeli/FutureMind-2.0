import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Ícone de lupa
import "./CSS/HistoricoConsulta.css";

const appointments = [
  {
    date: "2025-02-10",
    time: "14:00",
    therapist: "Dr. Ana Souza",
    status: "Concluída",
  },
  {
    date: "2025-02-15",
    time: "16:30",
    therapist: "Dr. Carlos Lima",
    status: "Pendente",
  },
  {
    date: "2025-02-20",
    time: "10:00",
    therapist: "Dra. Beatriz Mendes",
    status: "Cancelada",
  },
  {
    date: "2025-02-22",
    time: "15:00",
    therapist: "Dr. João Pereira",
    status: "Concluída",
  },
  {
    date: "2025-02-25",
    time: "11:00",
    therapist: "Dra. Maria Silva",
    status: "Pendente",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
  {
    date: "2025-03-01",
    time: "09:30",
    therapist: "Dr. Pedro Rocha",
    status: "Cancelada",
  },
];

export default function HistoricoConsulta() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Estado para armazenar a pesquisa ativa

  // Filtra as consultas com base no texto pesquisado
  const filteredAppointments = appointments.filter((appointment) =>
    `${appointment.date} ${appointment.therapist} ${appointment.time} ${appointment.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Atualiza a pesquisa ao clicar na lupa ou pressionar Enter
  const handleSearch = () => {
    setSearchQuery(search);
  };

  return (
    <div className="historico-container">
      <h1 className="historico-titulo">Histórico de Consultas</h1>

      {/* Barra de Pesquisa com Ícone */}
      <div className="historico-search-container">
        <input
          type="text"
          placeholder="Pesquisar consulta..."
          className="historico-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Ativa a pesquisa ao pressionar Enter
        />
        <button className="historico-search-button" onClick={handleSearch}>
          <FaSearch size={16} color="#fff" />
        </button>
      </div>

      <div className="historico-card">
        <div className="historico-card-content">
          <table className="historico-tabela">
            <thead>
              <tr className="historico-tabela-header">
                <th className="historico-tabela-coluna">Data</th>
                <th className="historico-tabela-coluna">Terapeuta</th>
                <th className="historico-tabela-coluna">Horário</th>
                <th className="historico-tabela-coluna">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <tr key={index} className="historico-tabela-linha">
                    <td>{appointment.date}</td>
                    <td>{appointment.therapist}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span
                        className={`historico-status historico-status-${appointment.status.toLowerCase()}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="historico-sem-resultados">
                    Nenhuma consulta encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
