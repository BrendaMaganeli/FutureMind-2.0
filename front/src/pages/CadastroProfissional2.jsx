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
  const [especializacaoValida, setEspecializacaoValida] = useState(true);
  const [abordagemValida, setAbordagemValida] = useState(true);
  const [emailValido, setEmailValido] = useState()
  const [senhaValido, setSenhaValido] = useState()
  const [valorEmail, setValorEmail] = useState()
  const [valorSenha, setValorSenha] =  useState()
  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState('icon_nao_ver.png')

  const handleCadastro = () => {
   
    let erro = false; // <- ADICIONA ISSO!

    if (especializacoes.length === 0) {
      setEspecializacaoValida(false);
      erro = true;
    } else {
      setEspecializacaoValida(true);
    }
  
    if (abordagens.length === 0) {
      setAbordagemValida(false);
      erro = true;
    } else {
      setAbordagemValida(true);
    }

    if(!valorEmail?.trim().endsWith("@gmail.com") && !valorEmail?.endsWith("@hotmail.com")){

      setEmailValido(true)
      erro = true;
    }else{
      setEmailValido(false)
      
    }
    if (!valorSenha || valorSenha.trim().length < 8) {
      setSenhaValido(true);
      erro = true
    }else{

      setSenhaValido(false)
      
    }

    if (!erro) {
      navigate('/inicio');
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
          <p className='titulo-cadastro'>Cadastro Profissional</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-cadastro-divP'>
        <div className='input-cadastro'>
            <label className='label-input'>Especialização</label>
            <Select
              className="custom-react-select"
              classNamePrefix="select"
              options={opcoesEspecializacao}
              isMulti
              onChange={(selectedOptions) => {
                const opcoes = selectedOptions || [];
                setEspecializacoes(opcoes);
                setEspecializacaoValida(opcoes.length > 0);
              }}
            />
            <div className={`container_alerta_nulo ${!especializacaoValida ? 'container_geral_mostra' : ''}`}>
              <p>Selecione pelo menos uma especialização.</p>
            </div>
          </div>

          <div className='input-cadastro'>
            <label className='label-input'>Abordagens</label>
            <Select
              className="custom-react-select"
              classNamePrefix="select"
              options={opcoesAbordagens}
              isMulti
              onChange={(selectedOptions) => {
                const opcoes = selectedOptions || [];
                setAbordagens(opcoes);
                setAbordagemValida(opcoes.length > 0);
              }}
            />
            <div className={`container_alerta_nulo ${!abordagemValida ? 'container_geral_mostra' : ''}`}>
              <p>Selecione pelo menos uma abordagem.</p>
            </div>
          </div>
          <div className='input-lados'>
            <div className='input-cadastro'>
              <label>Email</label>
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