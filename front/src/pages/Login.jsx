import { useNavigate} from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';
import { useState } from 'react';

function login() {
  const navigate = useNavigate(); // Hook para navegação


  const [valorEmail, setValorEmail] = useState('');
  const [valorSenha, setValorSenha] = useState('');

  const [emailValido, setEmailValido] = useState(false);
  const [senhaValido, setSenhaValido] = useState(false);

  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState('icon_nao_ver.png');

  const alternarTipo = () => {
    if (tipoInput === 'password') {
      setTipoInput('text');
      setTipoIconSenha('icon_ver.png');
    } else {
      setTipoInput('password');
      setTipoIconSenha('icon_nao_ver.png');
    }
  };

  const handleCadastro = () => {
    let validacoes = true;

    // Email
    if (!valorEmail?.trim().endsWith("@gmail.com") && !valorEmail?.trim().endsWith("@hotmail.com")) {
      setEmailValido(true);
      validacoes = false;
    } else {
      setEmailValido(false);
    }

    // Senha
    if (!valorSenha || valorSenha.trim().length < 8) {
      setSenhaValido(true);
      validacoes = false;
    } else {
      setSenhaValido(false);
    }

    // Se tudo estiver válido, redireciona
    if (validacoes) {
      navigate('/cadastroprofissional2');
    }
  };

  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Bem vindo de volta!</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-login-div'>
          
        <div className="login-input">
            <input type="text" value={valorEmail} onChange={(e) => {
              setValorEmail(e.target.value);
              setEmailValido(false);
            }} placeholder=" " required />
            <label>E-mail</label>
            <span className={`erro ${emailValido ? 'visivel' : ''}`}>E-mail deve terminar com @gmail.com ou @hotmail.com</span>
          </div>

          <div className="login-input">
            <input 
              type={tipoInput} 
              value={valorSenha} 
              onChange={(e) => {
                setValorSenha(e.target.value);
                setSenhaValido(false);
              }} 
              placeholder=" " 
              required 
            />
            <label>Senha</label>
            <span className={`erro ${senhaValido ? 'visivel' : ''}`}>Mínimo 8 caracteres</span>
            <img 
              src={tipoIconSenha} 
              alt="Mostrar senha" 
              className="icone-senha-login" 
              onClick={alternarTipo} 
            />
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

export default login;
