import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import logo from "../assets/logoCadastro2.svg";
import imagem from "../assets/FotoCadastro.svg";
import "./CSS/Cadastros.css";
import { useState } from "react";

function CadastroProfissional1() {
  const navigate = useNavigate();
  const { profissional, setProfissional } = useContext(GlobalContext);

  const [nome, setNome] = useState(profissional.nome);
  const [valorCRP, setValorCRP] = useState(profissional.crp);
  const [telefone, setTelefone] = useState(profissional.telefone);
  const [cpf, setCpf] = useState(profissional.cpf);
  const [dataNascimento, setDataNascimento] = useState(
    profissional.data_nascimento ? formatarDataParaBR(profissional.data_nascimento) : profissional.data_nascimento
  );
  const [valorConsulta, setValorConsulta] = useState(
    profissional.valor_consulta ? `R$ ${profissional.valor_consulta}` : profissional.valor_consulta
  );

  const [nomeValido, setNomeValido] = useState(false);
  const [crpValido, setCrpValido] = useState(false);
  const [telefoneValido, setTelefoneValido] = useState(false);
  const [dataNascimentoValido, setDataNascimentoValido] = useState(false);
  const [cpfValido, setCpfValido] = useState(false);
  const [valorConsultaValido, setValorConsultaValido] = useState(false);

  const [mensagemCrp, setMensagemCrp] = useState('');
  const [mensagemTelefone, setMensagemTelefone] = useState('');
  const [mensagemCpf, setMensagemCpf] = useState('');

  useEffect(() => {
    setProfissional({
      nome,
      crp: valorCRP,
      telefone,
      data_nascimento: converterParaFormatoBanco(dataNascimento),
      cpf,
      valor_consulta: formatarValorConsultaB(valorConsulta),
    });
  }, [nome, valorCRP, telefone, dataNascimento, cpf, valorConsulta]);

  const formatarNome = (value) => value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");

  const formatarCRP = (value) => {
    value = value.replace(/\D/g, "");
    if (value.length <= 2) return value;
    return value.slice(0, 2) + "/" + value.slice(2, 7);
  };

  const formatarTelefone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    return value.slice(0, 15);
  };

  const formatarCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    return value.slice(0, 14);
  };

  const formatarData = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    return value.slice(0, 10);
  };

  function formatarDataParaBR(dataBanco) {
    if (!dataBanco || !/^\d{4}-\d{2}-\d{2}$/.test(dataBanco)) return "Data inválida";
    const [ano, mes, dia] = dataBanco.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const converterParaFormatoBanco = (data) => {
    if (!data || data.split("/").length !== 3) return "";
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const formatarValorConsulta = (valor) => {
    if (!valor) return "";
    let numeros = valor.replace(/\D/g, "");
    if (numeros.length === 0) return "";
    const valorNumerico = parseFloat(numeros) / 100;
    return valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const formatarValorConsultaB = (valor) => {
    if (!valor) return "";
    const valorNumerico = parseFloat(
      valor.replace(/[^\d,-]/g, '').replace(',', '.')
    );
    return isNaN(valorNumerico) ? "" : valorNumerico.toFixed(2);
  };

  const handleCadastro = async () => {
    let validacoes = true;
    let data;

    try {
      const response = await fetch("http://localhost:4242/verificar_profissional_um", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valorCRP, cpf, telefone }),
      });

      if (response.ok) data = await response.json();
    } catch (error) {
      console.log('erro');
    }

    if (nome.trim().length < 1) {
      setNomeValido(true);
      validacoes = false;
    } else setNomeValido(false);

    if (valorCRP.trim().length < 8 || !/^\d{2,3}\/\d{4,5}$/.test(valorCRP)) {
      setCrpValido(true);
      setMensagemCrp('Crp invalido!');
      validacoes = false;
    } else if (data.crpExisteProf) {
      setCrpValido(true);
      setMensagemCrp('Crp já cadastrado!');
      validacoes = false;
    } else setCrpValido(false);

    if (cpf.trim().length < 14) {
      setCpfValido(true);
      setMensagemCpf('Cpf invalido!');
      validacoes = false;
    } else if (data.cpfExisteProf) {
      setCpfValido(true);
      setMensagemCpf('Cpf já cadastrado !');
      validacoes = false;
    } else setCpfValido(false);

    if (telefone.trim().length < 15) {
      setTelefoneValido(true);
      setMensagemTelefone('Telefone invalido!');
      validacoes = false;
    } else if (data.telefoneExisteProf) {
      setTelefoneValido(true);
      setMensagemTelefone('Telefone já cadastrado!');
      validacoes = false;
    } else setTelefoneValido(false);

    if (dataNascimento.length === 10) {
      const [dia, mes, ano] = dataNascimento.split("/").map(Number);
      const nascimento = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const naoFezAniversario = hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());

      if (naoFezAniversario) idade--;

      if (idade < 18 || isNaN(nascimento.getTime())) {
        setDataNascimentoValido(true);
        validacoes = false;
      } else setDataNascimentoValido(false);
    } else {
      setDataNascimentoValido(true);
      validacoes = false;
    }

    const valorNumerico = parseFloat(
      valorConsulta
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    );

    if (isNaN(valorNumerico) || valorNumerico < 50) {
      setValorConsultaValido(true);
      validacoes = false;
    } else setValorConsultaValido(false);

    if (validacoes) navigate("/cadastroprofissional2");
  };

  return (
    <div className="container-profissional">
      <div className="lado-esquerdoProfissional">
        <div className="titulo-logo">
          <p className="titulo-cadastro">Cadastro Profissional</p>
          <img src={logo} alt="Future Mind Logo" className="logo-paraCadastro" />
        </div>
        
        <div className="inputs-cadastro-div">
          <div className="cadastro-input">
            <input
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(formatarNome(e.target.value));
                setNomeValido(false);
              }}
              placeholder=" "
              required
            />
            <label>Nome Completo</label>
            <span className={`erro ${nomeValido ? "visivel" : ""}`}>
              Nome obrigatório
            </span>
          </div>

          <div className="cadastro-input">
            <input
              type="text"
              value={valorCRP}
              onChange={(e) => {
                setValorCRP(formatarCRP(e.target.value));
                setCrpValido(false);
              }}
              placeholder=" "
              required
            />
            <label>CRP</label>
            <span className={`erro ${crpValido ? "visivel" : ""}`}>
              {mensagemCrp}
            </span>
          </div>

          <div className="cadastro-input">
            <input
              type="text"
              value={telefone}
              onChange={(e) => {
                setTelefone(formatarTelefone(e.target.value));
                setTelefoneValido(false);
              }}
              placeholder=" "
              required
            />
            <label>Telefone</label>
            <span className={`erro ${telefoneValido ? "visivel" : ""}`}>
              {mensagemTelefone}
            </span>
          </div>

          <div className="cadastro-input">
            <input
              type="text"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(formatarData(e.target.value));
                setDataNascimentoValido(false);
              }}
              placeholder=" "
              required
            />
            <label>Data de Nascimento</label>
            <span className={`erro ${dataNascimentoValido ? "visivel" : ""}`}>
              Idade mínima é 18 anos
            </span>
          </div>

          <div className="cadastro-input">
            <input
              type="text"
              value={cpf}
              onChange={(e) => {
                setCpf(formatarCPF(e.target.value));
                setCpfValido(false);
              }}
              placeholder=" "
              required
            />
            <label>CPF</label>
            <span className={`erro ${cpfValido ? "visivel" : ""}`}>
              {mensagemCpf}
            </span>
          </div>

          <div className="cadastro-input">
            <input
              type="text"
              value={valorConsulta}
              onChange={(e) => {
                setValorConsulta(formatarValorConsulta(e.target.value));
                setValorConsultaValido(false);
              }}
              placeholder=" "
              required
            />
            <label>Valor da Consulta</label>
            <span className={`erro ${valorConsultaValido ? "visivel" : ""}`}>
              Mínimo de R$ 50,00
            </span>
          </div>
        </div>
        
        <button className="botao-cadastro-profissional" onClick={handleCadastro}>
          Prosseguir com cadastro
        </button>
        
        <p className="login-texto">
          Já possui uma conta no nosso site? <a href="/login">Aperte aqui</a>
        </p>
      </div>
      
      <div className="lado-direitoProfissional">
        <img src={imagem} alt="Cadastro Profissional" className="imagem-cadastro" />
      </div>
    </div>
  );
}

export default CadastroProfissional1;