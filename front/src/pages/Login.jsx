import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';

function CadastroProfissional2() {
  const navigate = useNavigate(); // Hook para navegação

  const handleCadastro = () => {
    navigate('/cadastroProfissional2'); // Redireciona para a próxima página
  };

  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Bem vindo de volta!</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-login-div'>
          <div className='input-login'>
            <label>Nome</label>
            <input type='text' />
          </div>
          
          <div className='input-login'>
            <label>Telefone</label>
            <input type='text' />
          </div>
          
          <div className='input-login'>
            <label>CPF</label>
            <input type='text' />
          </div>
        </div>
        <button className='botao-login' onClick={handleCadastro}>Realizar Login</button>
        <p className='login-texto'>Ainda não possui cadastro?<a href='/cadastroprofissional1'>Aperte aqui</a></p>
      </div>
      <div className='lado-direitoProfissional'>
        <img src={imagem} alt='Cadastro Profissional' className='imagem-cadastro' />
      </div>
    </div>
  );
}

export default CadastroProfissional2;
