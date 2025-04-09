import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';
import { useState } from 'react';

function CadastroProfissional1() {
  const navigate = useNavigate(); // Hook para navegação
  
  const [nome, setNome] = useState('');
  const [nomeValido, setNomeValido] = useState()
  const [ValorCRP, setValorCRP] = useState()
  const [crpValido, setCrpValido] = useState('')
  const [telefone, setTelefone] = useState()
  const [telefoneValido, setTelefoneValido] = useState('')
  const [dataNascimentoValido, setDataNascimentoValido] = useState()
  const [dataNascimento, setDataNascimento] = useState('')
  const [cpf, setCpf] = useState('');
  const [cpfValido, setCpfValido] = useState()
  const [valorConsulta, setValorConsulta] = useState()
  const [valorConsultaValido , setValorConsultaValido] = useState()
  
  const handleCadastro = () => {

    let erro = false;

    if (!nome || nome.trim().length === 0) {
      setNomeValido(true);
      erro = true;
    } else {
      setNomeValido(false);
    }
  
    if (!cpf || cpf.trim().length !== 14) {
      setCpfValido(true);
      erro = true;
    } else {
      setCpfValido(false);
    }
  
    if (!telefone || telefone.trim().length !== 15) {
      setTelefoneValido(true);
      erro = true;
    } else {
      setTelefoneValido(false);
    }
  
    if (!dataNascimento || dataNascimento.trim().length !== 10) {
      setDataNascimentoValido(true);
      erro = true;
    } else {
      // Validação da idade (já feita no input)
      const dia = parseInt(dataNascimento.slice(0, 2), 10);
      const mes = parseInt(dataNascimento.slice(3, 5), 10);
      const ano = parseInt(dataNascimento.slice(6, 10), 10);
      const nascimento = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      if (
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() &&
          hoje.getDate() < nascimento.getDate())
      ) {
        idade--;
      }
  
      setDataNascimentoValido(idade < 18);
      if (idade < 18) erro = true;
    }
  
    if (!ValorCRP || ValorCRP.length !== 8) {
      setCrpValido(true);
      erro = true;
    } else {
      setCrpValido(false);
    }
  
    if (!valorConsulta || valorConsulta === '' || parseFloat(valorConsulta.replace(/[^\d]/g, '')) < 5000) {
      setValorConsultaValido(true);
      erro = true;
    } else {
      setValorConsultaValido(false);
    }
  
    if (!erro) {
    
     
      navigate('/cadastroprofissional2'); 
    }
  };
  
  const formatarNome = (value) => {
  
    return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ''); 
   };
  
    
  
    const identificadorNome = (e) => {

      const nomeAux = e.target.value;
      setNome(formatarNome(nomeAux));

      if (nomeAux.length > 0) {

        setNomeValido(false);
      } else {

        setNomeValido(true)
      }
    };


  const indentificadorCRP = (e) => {

    let valor = e.target.value;

    valor = valor.replace(/\D/g, ''); 
    valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    valor = valor.slice(0, 8); 
  
    if(valor.length == 8){
   
      setCrpValido(false)

    }else{

      setCrpValido(true)
    }

    setValorCRP(valor);
  }

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

  const formatarCPF = (cpf) => {

    cpf = cpf.replace(/\D/g, ''); 
    cpf = cpf.slice(0, 11); 
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
  };

  const identificadorCpf = (e) => {

    const cpfAux = e.target.value
    setCpf(formatarCPF(cpfAux));

    if (cpfAux.trim().length == 14) {

      setCpfValido(false);
    } else {

      setCpfValido(true)
    }
  };

  const identificadorValorConsulta = (e) => {

    let valor = e.target.value;

    
    valor = valor.replace(/\D/g, '');
  
 
    const valorNumerico = parseFloat(valor) / 100;
  
    const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  
    setValorConsulta(valorFormatado);
  
    if (valorNumerico >= 50) {
      setValorConsultaValido(false);
    } else {
      setValorConsultaValido(true);
    }
  }
  

  return (
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
          <p className='titulo-cadastro'>Cadastro Profissional</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
        </div>
        <div className='inputs-cadastro-div'>
          <div className='input-cadastro'>
            <label>Nome completo</label>
            <input
             type='text'
             onChange={identificadorNome}
             value={nome} 
             />
             <div className={`container_alerta_nulo ${nomeValido ? 'container_geral_mostra' : ''}`}>
              <p>Nome invalido!</p>
             </div>
          </div>
          <div className='input-cadastro'>
            <label>CRP</label>
            <input
             type='text'
             value={ValorCRP}
             onChange={indentificadorCRP} 
            maxLength={8}
            />
            <div className={`container_alerta_nulo ${crpValido ? 'container_geral_mostra' : ''}`}>
              <p>CRP invalido!</p>
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
            <label>CPF</label>
            <input 
            type='text'
            value={cpf}
            onChange={identificadorCpf}
            maxLength="14"
             />
             <div className={`container_alerta_nulo ${cpfValido ? 'container_geral_mostra' : ''}`}>
              <p>CPF invalido!</p>
            </div>
          </div>
          <div className='input-cadastro'>
            <label>Valor Consulta</label>
            <input
             type='text'
             value={valorConsulta} 
             onChange={identificadorValorConsulta} 
             />
             <div className={`container_alerta_nulo ${valorConsultaValido ? 'container_geral_mostra' : ''}`}>
              <p>Valor minimo de 50R$!</p>
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

export default CadastroProfissional1;
