import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';
import { useState } from 'react';

function CadastroPaciente() {
   const navigate = useNavigate(); // Hook para navegação
   const [nomeValido, setNomeValido] = useState()
   const [cpfValido, setCpfValido] = useState()
   const [telefoneValido, setTelefoneValido] = useState()
   const [dataNascimentoValido, setDataNascimentoValido] = useState()
   const [emailValido, setEmailValido] = useState()
   const [senhaValido, setSenhaValido] = useState()
   const [valorEmail, setValorEmail] = useState()
   const [valorSenha, setValorSenha] =  useState()

   const handleCadastro = () => {
    if(nomeValido == false && cpfValido == false && telefoneValido == false && dataNascimentoValido == false && emailValido == false && senhaValido == false){

      navigate('/cadastroProfissional2');
    }
    if(nome.trim().length < 1){

       setNomeValido(true)
    }
    if(cpf.trim().length < 14){

      setCpfValido(true)
    }
    if(telefone.trim().length < 15){

      setTelefoneValido(true)
    }
    if(dataNascimento.trim().length < 8){

      setDataNascimentoValido(true)
    }
    if(!valorEmail?.trim().endsWith("@gmail.com") && !valorEmail?.endsWith("@hotmail.com")){

      setEmailValido(true)
    }
    if (!valorSenha || valorSenha.trim().length < 8) {
      setSenhaValido(true);
    }
    
  }

   const formatarCPF = (value) => {
   
     value = value.replace(/\D/g, ''); 
     value = value.replace(/^(\d{3})(\d)/, "$1.$2"); 
     value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3"); 
     value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
     return value.slice(0, 14); 

   };

   const formatarNome = (value) => {
  
    return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ''); 
   };
  
    const [nome, setNome] = useState('');
  
    const identificadorNome = (e) => {

      const nomeAux = e.target.value;
      setNome(formatarNome(nomeAux));

      if (nomeAux.length > 0) {

        setNomeValido(false);
      } else {

        setNomeValido(true)
      }
    };

 
    const [cpf, setCpf] = useState('');
  
    const identificadorCpf = (e) => {
      const cpfAux = e.target.value
      setCpf(formatarCPF(cpfAux));

      if (cpfAux.trim().length == 14) {

        setCpfValido(false);
      } else {

        setCpfValido(true)
      }
    };

   const [telefone, setTelefone] = useState('');

   const identificadorTelefone = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
     
    setTelefone(value);
  
    if(value.trim().length == 15){

      setTelefoneValido(false)
    }else{

      setTelefoneValido(true)
    }
   }

   const [dataNascimento, setDataNascimento] = useState('')

   const identificadorData = (e) => {

    let value = e.target.value;
    
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    setDataNascimento(value);

    if (value.length === 10) {

        const dia = parseInt(value.slice(0, 2), 10);
        const mes = parseInt(value.slice(3, 5), 10);
        const ano = parseInt(value.slice(6, 10), 10);
    
        const nascimento = new Date(ano, mes - 1, dia);
        const hoje = new Date();
    
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const aniversarioAindaNaoPassou = 
            hoje.getMonth() < nascimento.getMonth() || 
            (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
    
        if (aniversarioAindaNaoPassou) {
            idade--;
        }
    
        setDataNascimentoValido(idade < 18);
    } else {
        setDataNascimentoValido(true);
    }
  }

   const [tipoInput, setTipoInput] = useState("password");
   const [tipoIconSenha, setTipoIconSenha] = useState('icon_nao_ver.png')

   const alternarTipo = () => {

     if(tipoInput == 'password'){

      setTipoInput('text')
      setTipoIconSenha('icon_ver.png')

     }else{

      setTipoInput('password')
      setTipoIconSenha('icon_nao_ver.png')
     }
   };

   const indentificadorEmail = (e) =>{

    let valor_email = e.target.value 
    setValorEmail(valor_email)
    if(valor_email.trim().endsWith("@gmail.com") || valor_email.endsWith("@gmail.com") ){

      setEmailValido(false)
    }else{

      setEmailValido(true)
    }
   }

   const indentificadorSenha = (e) => {

    let valor_senha = e.target.value
    setValorSenha(valor_senha)
    if(valor_senha.trim().length >= 8){

      setSenhaValido(false)

    }else{

      setSenhaValido(true)
    }
   }
 
  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Cadastro Paciente</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-cadastro-div'>
          <div className='input-cadastro'>
            <label>Nome completo</label>
            <input 
            type="text"
            value={nome}
            onChange={identificadorNome }
            />
           <div className={`container_alerta_nulo ${nomeValido ? 'container_geral_mostra' : ''}`}>
              <p>Nome invalido!</p>
            </div>
          </div>
          <div className='input-cadastro'>
            <label>CPF</label>
            <input
            value={cpf}
            onChange={identificadorCpf}
            maxLength="14"
            type='text' />
            <div className={`container_alerta_nulo ${cpfValido ? 'container_geral_mostra' : ''}`}>
              <p>CPF invalido!</p>
            </div>
          </div>
          <div className='input-cadastro'>
            <label>Telefone</label>
            <input
            type='text'
            value={telefone} 
            maxLength="14"
            onChange={identificadorTelefone}
          />
           <div className={`container_alerta_nulo ${telefoneValido ? 'container_geral_mostra' : ''}`}>
              <p>Telefone invalido!</p>
            </div>
          </div>
          <div className='input-cadastro'>
            <label>Data de nascimento</label>
            <input 
             type='text'
             value={dataNascimento} 
             maxLength="8"
             onChange={identificadorData} 
            />
            <div className={`container_alerta_nulo ${dataNascimentoValido ? 'container_geral_mostra' : ''}`}>
              <p>Você não é maior que 18 anos!</p>
            </div>

          </div>
          <div className='input-cadastro'>
            <label>E-mail</label>
            <input 
            type='text'
            onChange={indentificadorEmail}
            />
            <div className={`container_alerta_nulo ${emailValido ? 'container_geral_mostra' : ''}`}>
              <p>Email incorreto!</p>
            </div>
          </div>
          <div className='input-cadastro'>
            <label>Senha</label>
             <input 
             type={tipoInput}  
             maxLength={15}
             onChange={indentificadorSenha}
             />
             <div className={`container_alerta_nulo ${senhaValido ? 'container_geral_mostra' : ''}`}>
              <p>Senha deve ter no minimo 8 caracteres!</p>
            </div>

            <img 
            onClick={alternarTipo}
            className='imagem_olho'
            src={tipoIconSenha} alt=""
            />
          </div>
        </div>
        <div className='div-check'>
          <div className='container_styles-check'>
            <input className='styles-check' type="checkbox" name="" id="" />
          </div>
         <label className='termos-styles' htmlFor="">Aceitar os</label> <a className='termos-a' href="termos">termos</a> <label className='de_uso' htmlFor="">de uso</label>
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
