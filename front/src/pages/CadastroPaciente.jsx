import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logoCadastro2.svg";
import imagem from "../assets/FotoCadastro.svg";
import "./CSS/Cadastros.css";

function CadastroPaciente() {
  const navigate = useNavigate();

  // Estados de dados do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [valorEmail, setValorEmail] = useState("");
  const [valorSenha, setValorSenha] = useState("");
  const [paciente, setPaciente] = useState({});

  // Estados de validação
  const [nomeValido, setNomeValido] = useState(false);
  const [cpfValido, setCpfValido] = useState(false);
  const [telefoneValido, setTelefoneValido] = useState(false);
  const [dataNascimentoValido, setDataNascimentoValido] = useState(false);
  const [emailValido, setEmailValido] = useState(false);
  const [senhaValido, setSenhaValido] = useState(false);

  // Estados de senha visível
  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState("icon_nao_ver.png");
  const [mensagemCpf, setMensagemCpf] = useState("");
  const [mensagemTelefone, setMensagemTelefone] = useState("");
  const [mensagemEmail, setMensagemEmail] = useState("");

  const alternarTipo = () => {
    setTipoInput(tipoInput === "password" ? "text" : "password");
    setTipoIconSenha(
      tipoInput === "password" ? "icon_ver.png" : "icon_nao_ver.png"
    );
  };

  const formatarCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    return value.slice(0, 14);
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

  const converterParaFormatoBanco = (data) => {
    if (!data || data.split("/").length !== 3) return "";
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const handleFinish = async () => {
    try {
      const pacienteAux = {
        Nome_completo: nome,
        cpf: cpf,
        Idade: converterParaFormatoBanco(dataNascimento),
        Telefone: telefone,
        Email: valorEmail,
        Senha: valorSenha,
      };

      setPaciente(pacienteAux);

      const response = await fetch(
        "https://futuremind-2-0-mw60.onrender.com/cadastro-paciente",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pacienteAux),
        }
      );

      if (response.ok) {
        setPaciente({
          Nome_completo: "",
          cpf: "",
          Idade: "",
          Telefone: "",
          Email: "",
          Senha: "",
        });
        navigate("/login");
      }
    } catch (err) {
      console.log({ err: "Erro no servidor" });
    }
  };

  const handleCadastro = async (e) => {
    if (e) e.preventDefault();
    let validacoes = true;
    let data = {};
    try {

      const response = await fetch("http://localhost:4242/verificar_paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valorEmail, cpf, telefone }),
      });
      
      if (response.ok) {
        data = await response.json();
      }
    } catch (error) {
      console.log("erro");
    }

    if (nome.trim().length < 1) {
      setNomeValido(true);
      validacoes = false;
    } else {
      setNomeValido(false);
    }

    if (cpf.trim().length < 14) {
      setCpfValido(true);
      setMensagemCpf("CPF inválido!");
      validacoes = false;
    } else if (data.cpfExiste) {
      setCpfValido(true);
      setMensagemCpf("CPF já cadastrado!");
      validacoes = false;
    } else {
      setCpfValido(false);
      setMensagemCpf("");
    }

    if (telefone.trim().length < 15) {
      setTelefoneValido(true);
      setMensagemTelefone("Telefone inválido!");
      validacoes = false;
    } else if (data.telefoneExiste) {
      setTelefoneValido(true);
      setMensagemTelefone("Telefone já cadastrado!");
      validacoes = false;
    } else {
      setTelefoneValido(false);
      setMensagemTelefone("");
    }

    if (dataNascimento.length === 10) {
      const [dia, mes, ano] = dataNascimento.split("/").map(Number);
      const nascimento = new Date(ano, mes - 1, dia);

      const dataInvalida =
        nascimento.getFullYear() !== ano ||
        nascimento.getMonth() !== mes - 1 ||
        nascimento.getDate() !== dia;

      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const naoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() &&
          hoje.getDate() < nascimento.getDate());

      if (naoFezAniversario) idade--;

      if (dataInvalida || idade < 18) {
        setDataNascimentoValido(true);
        validacoes = false;
      } else {
        setDataNascimentoValido(false);
      }
    } else {
      setDataNascimentoValido(true);
      validacoes = false;
    }

    const emailFormatado =
      valorEmail.trim().endsWith("@gmail.com") ||
      valorEmail.trim().endsWith("@hotmail.com");

    if (!emailFormatado) {
      setEmailValido(true);
      setMensagemEmail("Email inválido!");
      validacoes = false;
    } else if (data.emailExiste) {
      setEmailValido(true);
      setMensagemEmail("Email já cadastrado!");
      validacoes = false;
    } else {
      setEmailValido(false);
      setMensagemEmail("");
    }

    if (!valorSenha || valorSenha.trim().length < 8) {
      setSenhaValido(true);
      validacoes = false;
    } else {
      setSenhaValido(false);
    }

    if (validacoes) {
      await handleFinish();
    }
  };

  return (
    <div className="container-profissional">
      <div className="lado-esquerdoProfissional">
        <div className="titulo-logo">
          <p className="titulo-cadastro">Cadastro Paciente</p>
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
              value={valorEmail}
              onChange={(e) => {
                setValorEmail(e.target.value);
                setEmailValido(false);
              }}
              placeholder=" "
              required
            />
            <label>E-mail</label>
            <span className={`erro ${emailValido ? "visivel" : ""}`}>
              {mensagemEmail}
            </span>
          </div>

          <div className="cadastro-input">
            <input
              type={tipoInput}
              value={valorSenha}
              onChange={(e) => {
                setValorSenha(e.target.value);
                setSenhaValido(false);
              }}
              placeholder=""
              required
            />
            <label>Senha</label>
            <span className={`erro ${senhaValido ? "visivel" : ""}`}>
              Mínimo 8 caracteres
            </span>
            <img
              src={tipoIconSenha}
              alt="Mostrar senha"
              className="icone-senha"
              onClick={alternarTipo}
            />
          </div>
        </div>

        <div className="div-check">
          <div className="container_styles-check">
            <input className="styles-check" type="checkbox" />
          </div>
          <label className="termos-styles">Aceitar os</label>{" "}
          <a className="termos-a" href="/termos">
            termos
          </a>{" "}
          <label className="de_uso">de uso</label>
        </div>

        <button className="botao-cadastro" onClick={handleCadastro}>
          Finalizar Cadastro
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

export default CadastroPaciente;
