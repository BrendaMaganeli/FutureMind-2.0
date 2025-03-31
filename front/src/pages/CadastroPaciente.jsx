import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';
import { useState } from 'react';

function CadastroPaciente() {
   const navigate = useNavigate(); // Hook para navegação

   const handleCadastro = () => {

      navigate('/cadastroProfissional2'); 
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
      setNome(formatarNome(e.target.value));
    };

 
    const [cpf, setCpf] = useState('');
  
    const identificadorCpf = (e) => {
      setCpf(formatarCPF(e.target.value));
    };

   const [telefone, setTelefone] = useState('');

   const identificadorTelefone = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');

     
    setTelefone(value);
   }

   const [dataNascimento, setDataNascimento] = useState('')

   const identificadorData = (e) => {

    let value = e.target.value
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');

    setDataNascimento(value)
   }

   const [tipoInput, setTipoInput] = useState("password");
   const [tipoIconSenha, setTipoIconSenha] = useState('icon_ver.png')

   const alternarTipo = () => {

     if(tipoInput == 'password'){

      setTipoInput('text')
      setTipoIconSenha('icon_ver.png')

     }else{

      setTipoInput('password')
      setTipoIconSenha('icon_nao_ver.png')
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
          <div className='input-cadastro'>
            <label>Nome completo</label>
            <input 
            type="text"
            value={nome}
            onChange={identificadorNome}
            />
          </div>
          <div className='input-cadastro'>
            <label>CPF</label>
            <input
            value={cpf}
            onChange={identificadorCpf}
            maxLength="14"
            type='text' />
          </div>
          <div className='input-cadastro'>
            <label>Telefone</label>
            <input
            type='text'
            value={telefone} 
            maxLength="14"
            onChange={identificadorTelefone}
          />
          </div>
          <div className='input-cadastro'>
            <label>Data de nascimento</label>
            <input 
             type='text'
             value={dataNascimento} 
             maxLength="8"
             onChange={identificadorData} 
            />
          </div>
          <div className='input-cadastro'>
            <label>E-mail</label>
            <input type='text' />
          </div>
          <div className='input-cadastro'>
            <label>Senha</label>
             <input 
             type={tipoInput} 
             maxLength={8}/>
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
