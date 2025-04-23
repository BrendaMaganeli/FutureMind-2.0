import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';
import { useState } from 'react';

function CadastroPaciente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [valorEmail, setValorEmail] = useState('');
  const [valorSenha, setValorSenha] = useState('');

  const hand = async () => {
    try {
      const paciente = {
        Nome_completo: nome,
        cpf: cpf,
        Idade: dataNascimento,
        Email: valorEmail,
        Telefone: telefone,
        Senha: valorSenha
      }
      const response = await fetch('https://localhost:4242/cadastro-paciente',{

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(paciente)
      })

      if(response.ok){

        navigate('/login');
      
      }
    } catch (err) {
       console.log({err: 'erro servidor'})
    }
  }

  const [nomeValido, setNomeValido] = useState(false);
  const [cpfValido, setCpfValido] = useState(false);
  const [telefoneValido, setTelefoneValido] = useState(false);
  const [dataNascimentoValido, setDataNascimentoValido] = useState(false);
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

  const formatarCPF = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    return value.slice(0, 14);
  };

  const formatarTelefone = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return value.slice(0, 15);
  };

  const formatarData = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    return value.slice(0, 10);
  };

  const formatarNome = (value) => {
    return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
  };

  const fazRequisicao = async () => {

    try {

      const res = await fetch('https://localhost:4242', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nome)
      }) 

    } catch (err) {

      console.error(err);
    }
  }

  const handleCadastro = () => {
    let validacoes = true;

    // Nome
    if (nome.trim().length < 1) {
      setNomeValido(true);
      validacoes = false;
    } else {
      setNomeValido(false);
    }

    // CPF
    if (cpf.trim().length < 14) {
      setCpfValido(true);
      validacoes = false;
    } else {
      setCpfValido(false);
    }

    // Telefone
    if (telefone.trim().length < 15) {
      setTelefoneValido(true);
      validacoes = false;
    } else {
      setTelefoneValido(false);
    }

    // Data de nascimento
    if (dataNascimento.length === 10) {
      const [dia, mes, ano] = dataNascimento.split('/').map(Number);
      const nascimento = new Date(ano, mes - 1, dia);

      if (
        nascimento.getFullYear() !== ano ||
        nascimento.getMonth() !== mes - 1 ||
        nascimento.getDate() !== dia
      ) {
        setDataNascimentoValido(true);
        validacoes = false;
      } else {
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const naoFezAniversario = hoje.getMonth() < nascimento.getMonth() ||
          (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());

        if (naoFezAniversario) idade--;

        if (idade < 18) {
          setDataNascimentoValido(true);
          validacoes = false;
        } else {
          setDataNascimentoValido(false);
        }
      }
    } else {
      setDataNascimentoValido(true);
      validacoes = false;
    }

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
      navigate('/login');
    }
  };

  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Cadastro Paciente</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>

        <div className='inputs-cadastro-div'>
          <div className="cadastro-input">
            <input type="text" value={nome} onChange={(e) => {
              setNome(formatarNome(e.target.value));
              setNomeValido(false);
            }} placeholder=" " required />
            <label>Nome Completo</label>
            <span className={`erro ${nomeValido ? 'visivel' : ''}`}>Nome obrigatório</span>
          </div>

          <div className="cadastro-input">
            <input type="text" value={cpf} onChange={(e) => {
              setCpf(formatarCPF(e.target.value));
              setCpfValido(false);
            }} placeholder=" " required />
            <label>CPF</label>
            <span className={`erro ${cpfValido ? 'visivel' : ''}`}>CPF inválido</span>
          </div>

          <div className="cadastro-input">
            <input type="text" value={telefone} onChange={(e) => {
              setTelefone(formatarTelefone(e.target.value));
              setTelefoneValido(false);
            }} placeholder=" " required />
            <label>Telefone</label>
            <span className={`erro ${telefoneValido ? 'visivel' : ''}`}>Telefone inválido</span>
          </div>

          <div className="cadastro-input">
            <input type="text" value={dataNascimento} onChange={(e) => {
              setDataNascimento(formatarData(e.target.value));
              setDataNascimentoValido(false);
            }} placeholder=" " required />
            <label>Data de Nascimento</label>
            <span className={`erro ${dataNascimentoValido ? 'visivel' : ''}`}>Idade mínima é 18 anos</span>
          </div>

          <div className="cadastro-input">
            <input type="text" value={valorEmail} onChange={(e) => {
              setValorEmail(e.target.value);
              setEmailValido(false);
            }} placeholder=" " required />
            <label>E-mail</label>
            <span className={`erro ${emailValido ? 'visivel' : ''}`}>E-mail deve terminar com @gmail.com ou @hotmail.com</span>
          </div>

          <div className="cadastro-input">
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
              className="icone-senha" 
              onClick={alternarTipo} 
            />
          </div>
        </div>

        <div className='div-check'>
          <div className='container_styles-check'>
            <input className='styles-check' type="checkbox" />
          </div>
          <label className='termos-styles'>Aceitar os</label> <a className='termos-a' href="termos">termos</a> <label className='de_uso'>de uso</label>
        </div>

        <button className='botao-cadastro' onClick={hand}>Finalizar Cadastro</button>
        <p className='login-texto'>Já possui uma conta no nosso site? <a href='/login'>Aperte aqui</a></p>
      </div>

      <div className='lado-direitoProfissional'>
        <img src={imagem} alt='Cadastro Profissional' className='imagem-cadastro' />
      </div>
    </div>
  );
}

export default CadastroPaciente;
