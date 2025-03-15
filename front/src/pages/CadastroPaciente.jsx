import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';

function CadastroPaciente() {
  const navigate = useNavigate(); // Hook para navegação

  const handleCadastro = () => {
    navigate('/cadastroProfissional2'); // Redireciona para a próxima página
  };

  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Cadastro Paciente</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-cadastro-div'>
          <div className='input-cadastro'>
            <label>Nome</label>
            <input type='text' />
          </div>
          <div className='input-cadastro'>
            <label>CPF</label>
            <input type='text' />
          </div>
          <div className='input-cadastro'>
            <label>Telefone</label>
            <input type='text' />
          </div>
          <div className='input-cadastro'>
            <label>Data de nascimento</label>
            <input type='text' />
          </div>
          <div className='input-cadastro'>
            <label>E-mail</label>
            <input type='text' />
          </div>
          <div className='input-cadastro'>
            <label>Senha</label>
            <input type='text' />
          </div>
        </div>
        <div className='div-check'>
        <input className='styles-check' type="checkbox" name="" id="" /> <label className='termos-styles' htmlFor="">Aceitar os</label> <a className='termos-a' href="termos">termos</a> <label htmlFor="">de uso</label>
        </div>
        <button className='botao-cadastro' onClick={handleCadastro}>Finalizar Cadastro</button>
        <p className='login-texto'>Já possui uma conta no nosso site? <a href='/login'>Aperte aqui</a></p>
      </div>
      <div className='lado-direitoProfissional'>
        <img src={imagem} alt='Cadastro Profissional' className='imagem-cadastro' />
      </div>
    </div>
  );
}

export default CadastroPaciente;
