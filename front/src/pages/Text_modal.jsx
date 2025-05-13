import React, { useState } from 'react';

const usuariosMock = [
  'Mateus',
  'Matheus',
  'giovana',
  'Marcelo',
  'Marcos',
  'Marta',
  'Maurício',
  'Mariana'
];

export default function FiltroUsuarios() {
  const [busca, setBusca] = useState('');
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  const handleBusca = (e) => {
    const valor = e.target.value;
    setBusca(valor);

    if (valor === '') {
      setUsuariosFiltrados([]);
    } else {
      const filtrados = usuariosMock.filter((nome) =>
        nome.toLowerCase().includes(valor.toLowerCase())
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  const selecionarUsuario = (nome) => {
    setBusca(nome);
    setUsuariosFiltrados([]);
  };

  return (
    <div style={{ position: 'relative', width: '250px' }}>
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={busca}
        onChange={handleBusca}
        style={{ width: '100%', padding: '8px' }}
      />
      {usuariosFiltrados.length > 0 && (
        <div
          style={{
            border: '1px solid #ccc',
            position: 'absolute',
            width: '100%',
            background: 'white',
            zIndex: 1000,
            maxHeight: '150px',
            overflowY: 'auto'
          }}
        >
          {usuariosFiltrados.map((nome, index) => (
            <div
              key={index}
              onClick={() => selecionarUsuario(nome)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#eee')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
            >
              {nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}