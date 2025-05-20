import React, { useState } from "react";

// Simulando banco de dados em memória
const usuariosDB = [
  {
    id: 1,
    nome: "Mateus",
    temAssinatura: false,
    consultasFeitas: 0,
  },
];

export default function App() {
  const [usuario, setUsuario] = useState(usuariosDB[0]);
  const [mensagem, setMensagem] = useState("");

  const assinarPlano = () => {
    setUsuario({
      ...usuario,
      temAssinatura: true,
      consultasFeitas: 0,
    });
    setMensagem("Assinatura realizada com sucesso! Você pode fazer até 4 consultas por mês.");
  };

  const fazerConsulta = () => {
    if (!usuario.temAssinatura) {
      setMensagem("Você precisa assinar um plano para fazer consultas.");
      return;
    }

    if (usuario.consultasFeitas >= 4) {
      setMensagem("Limite de 4 consultas por mês atingido.");
      return;
    }

    const novoUsuario = {
      ...usuario,
      consultasFeitas: usuario.consultasFeitas + 1,
    };

    setUsuario(novoUsuario);
    setMensagem(`Consulta realizada com sucesso. Restam ${4 - novoUsuario.consultasFeitas} no mês.`);
  };

  return (
    <div style={estilos.container}>
      <h1>Bem-vindo, {usuario.nome}</h1>

      {!usuario.temAssinatura ? (
        <>
          <h2>Plano Mensal</h2>
          <p>R$ 49,90 - Até 4 consultas por mês</p>
          <button onClick={assinarPlano}>Assinar</button>
        </>
      ) : (
        <>
          <h2>Consultas do mês</h2>
          <p>Consultas feitas: {usuario.consultasFeitas} / 4</p>
          <button onClick={fazerConsulta} disabled={usuario.consultasFeitas >= 4}>
            Fazer consulta
          </button>
        </>
      )}

      {mensagem && <p style={estilos.mensagem}>{mensagem}</p>}
    </div>
  );
}

const estilos = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    marginTop: "40px",
  },
  mensagem: {
    marginTop: "20px",
    color: "#333",
  },
};
