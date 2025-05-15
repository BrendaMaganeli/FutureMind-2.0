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
  const [nomeValido, setNomeValido] = useState(false);
  const [valorCRP, setValorCRP] = useState(profissional.crp);
  const [crpValido, setCrpValido] = useState(false);
  const [telefone, setTelefone] = useState(profissional.telefone);
  const [telefoneValido, setTelefoneValido] = useState(false);
  const [dataNascimento, setDataNascimento] = useState(
    profissional.data_nascimento,
  );
  const [dataNascimentoValido, setDataNascimentoValido] = useState(false);
  const [cpf, setCpf] = useState(profissional.cpf);
  const [cpfValido, setCpfValido] = useState(false);
  
  const formatarValorConsulta = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    return `R$ ${numero.replace(".", ",")}`;
  };

  const formatarValorConsultaB = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    return numero
  };

  const [valorConsulta, setValorConsulta] = useState('');
  const [valorConsultaValido, setValorConsultaValido] = useState(false);

  const converterParaFormatoBanco = (data) => {
    if (!data || data.split("/").length !== 3) return "";
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

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

  const formatarCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    return value.slice(0, 14);
  };

  const formatarCRP = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não for número

    if (value.length <= 2) {
      return value; // ex: "0", "06"
    }

    return value.slice(0, 2) + "/" + value.slice(2, 7); // ex: "06/123456"
  };

  

  const formatarTelefone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    return value.slice(0, 15);
  };

  const formatarData = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    return value.slice(0, 10);
  };

  const formatarNome = (value) => {
    return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
  };

  const handleCadastro = () => {
    let validacoes = true;

    if (nome.trim().length < 1) {
      setNomeValido(true);
      validacoes = false;
    } else {
      setNomeValido(false);
    }

    if (valorCRP.trim().length < 6 || !/^\d{2,3}\/\d{4,5}$/.test(valorCRP)) {
      setCrpValido(true);
      validacoes = false;
    } else {
      setCrpValido(false);
    }

    if (cpf.trim().length < 14) {
      setCpfValido(true);
      validacoes = false;
    } else {
      setCpfValido(false);
    }

    if (telefone.trim().length < 15) {
      setTelefoneValido(true);
      validacoes = false;
    } else {
      setTelefoneValido(false);
    }

    if (dataNascimento.length === 10) {
      const [dia, mes, ano] = dataNascimento.split("/").map(Number);
      const nascimento = new Date(ano, mes - 1, dia);

      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const naoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() &&
          hoje.getDate() < nascimento.getDate());

      if (naoFezAniversario) idade--;

      if (idade < 18 || isNaN(nascimento.getTime())) {
        setDataNascimentoValido(true);
        validacoes = false;
      } else {
        setDataNascimentoValido(false);
      }
    } else {
      setDataNascimentoValido(true);
      validacoes = false;
    }

    const valorNumerico = parseFloat(
      valorConsulta
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim(),
    );

    if (isNaN(valorNumerico) || valorNumerico < 50) {
      setValorConsultaValido(true);
      validacoes = false;
    } else {
      setValorConsultaValido(false);
    }

    if (validacoes) {
      navigate("/cadastroprofissional2");
    }
  };

  return (
    <div className="container-profissional">
      <div className="lado-esquerdoProfissional">
        <div className="titulo-logo">
          <p className="titulo-cadastro">Cadastro Profissional</p>
          <img
            src={logo}
            alt="Future Mind Logo"
            className="logo-paraCadastro"
          />
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
              CRP inválido
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
              Telefone inválido
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
              CPF inválido
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
        <button className="botao-cadastro" onClick={handleCadastro}>
          Prosseguir com cadastro
        </button>
        <p className="login-texto">
          Já possui uma conta no nosso site? <a href="/login">Aperte aqui</a>
        </p>
      </div>
      <div className="lado-direitoProfissional">
        <img
          src={imagem}
          alt="Cadastro Profissional"
          className="imagem-cadastro"
        />
      </div>
    </div>
  );
}

export default CadastroProfissional1;
