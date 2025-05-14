import React, { useEffect, useState } from "react";

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [idadeSelecionada, setIdadeSelecionada] = useState("");
  const [trabalhoSelecionado, setTrabalhoSelecionado] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  // Simula dados vindos de um "banco de dados" via API
  useEffect(() => {
    async function carregarProfissionais() {
      // Aqui poderia ser um fetch real: fetch("/api/profissionais")
      const dados = [
        { id: 1, nome: "Ana", idade: 25, trabalho: "Designer" },
        { id: 2, nome: "Bruno", idade: 30, trabalho: "Desenvolvedor" },
        { id: 3, nome: "Carlos", idade: 25, trabalho: "Desenvolvedor" },
        { id: 4, nome: "Daniela", idade: 35, trabalho: "Gerente" },
        { id: 5, nome: "Eduarda", idade: 30, trabalho: "Designer" },
      ];
      setProfissionais(dados);
      setFiltrados(dados);
    }
    carregarProfissionais();
  }, []);

  const aplicarFiltro = () => {
    const resultado = profissionais.filter((p) => {
      const condIdade = idadeSelecionada === "" || p.idade === parseInt(idadeSelecionada);
      const condTrabalho = trabalhoSelecionado === "" || p.trabalho === trabalhoSelecionado;
      return condIdade && condTrabalho;
    });
    setFiltrados(resultado);
  };

  const idades = [...new Set(profissionais.map((p) => p.idade))];
  const trabalhos = [...new Set(profissionais.map((p) => p.trabalho))];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Filtro de Profissionais</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Idade: </label>
        <select value={idadeSelecionada} onChange={(e) => setIdadeSelecionada(e.target.value)}>
          <option value="">Todas</option>
          {idades.map((idade) => (
            <option key={idade} value={idade}>{idade}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Trabalho: </label>
        <select value={trabalhoSelecionado} onChange={(e) => setTrabalhoSelecionado(e.target.value)}>
          <option value="">Todos</option>
          {trabalhos.map((trabalho) => (
            <option key={trabalho} value={trabalho}>{trabalho}</option>
          ))}
        </select>
      </div>

      <button onClick={aplicarFiltro}>Filtrar</button>

      <h3>Resultados:</h3>
      <ul>
        {filtrados.map((p) => (
          <li key={p.id}>
            {p.nome} - {p.idade} anos - {p.trabalho}
          </li>
        ))}
      </ul>
    </div>
  );
}
