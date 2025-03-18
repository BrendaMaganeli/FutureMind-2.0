import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useState } from 'react';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';

const opcoesEspecializacao = [
  { value: 'psicologia-clinica', label: 'Psicologia Clínica' },
  { value: 'psicopedagogia', label: 'Psicopedagogia' },
  { value: 'neuropsicologia', label: 'Neuropsicologia' },
];

const opcoesAbordagens = [
  { value: 'cognitivo-comportamental', label: 'Cognitivo-Comportamental' },
  { value: 'psicanalise', label: 'Psicanálise' },
  { value: 'humanista', label: 'Humanista' },
];

function CadastroProfissional2() {
  const navigate = useNavigate(); // Hook para navegação
  const [especializacoes, setEspecializacoes] = useState([]);
  const [abordagens, setAbordagens] = useState([]);

  const handleCadastro = () => {
    navigate('/inicio'); // Redireciona para a próxima página
  };

  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Cadastro Profissional</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-cadastro-divP'>
          <div className='input-cadastro'>
            <label>Especialização</label>
            <Select
              options={opcoesEspecializacao}
              isMulti
              onChange={(selectedOptions) => setEspecializacoes(selectedOptions)}
            />
          </div>
          <div className='input-cadastro'>
            <label>Abordagens</label>
            <Select
              options={opcoesAbordagens}
              isMulti
              onChange={(selectedOptions) => setAbordagens(selectedOptions)}
            />
          </div>
          <div className='input-lados'>
            <div className='input-cadastro'>
              <label>Telefone</label>
              <input type='text' />
            </div>
            <div className='input-cadastro'>
              <label>Data de nascimento</label>
              <input type='text' />
            </div>
          </div>
        </div>
        <button className='botao-cadastro' onClick={handleCadastro}>Prosseguir com cadastro</button>
        <p className='login-texto'>Já possui uma conta no nosso site? <a href='/login'>Aperte aqui</a></p>
      </div>
      <div className='lado-direitoProfissional'>
        <img src={imagem} alt='Cadastro Profissional' className='imagem-cadastro' />
      </div>
    </div>
  );
}

export default CadastroProfissional2;