import { useNavigate } from "react-router-dom";
import logo from "../assets/logoCadastro2.svg";
import imagem from "../assets/FotoCadastro.svg";
import "./CSS/Cadastros.css";
import { useContext, useState } from "react";
import { GlobalContext } from "../Context/GlobalContext";

function login() {

  const { setUserLogado, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [valorEmail, setValorEmail] = useState("");
  const [valorSenha, setValorSenha] = useState("");

  const [emailValido, setEmailValido] = useState(false);
  const [senhaValido, setSenhaValido] = useState(false);

  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState("icon_nao_ver.png");

  const alternarTipo = () => {
    if (tipoInput === "password") {
      setTipoInput("text");
      setTipoIconSenha("icon_ver.png");
    } else {
      setTipoInput("password");
      setTipoIconSenha("icon_nao_ver.png");
    }
  };

  const handleLogin = async () => {
    const credentials = { email: valorEmail, senha: valorSenha };
    try {
      const response = await fetch("https://futuremind-2-0-mw60.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setUserLogado(true);
        setUser(data);
        navigate("/inicio");
      }
    } catch (err) {
      console.log("Erro no servidor", err);
    }
  };

  const handleCadastro = () => {
    let validacoes = true;

    // Email
    // Senha
    if (!valorSenha || valorSenha.trim().length < 8) {
      setSenhaValido(true);
      validacoes = false;
    } else {
      setSenhaValido(false);
    }

    // Se tudo estiver válido, redireciona
    if (validacoes) {
      handleLogin();
    }
  };

  return (
    <div className="container-profissional">
      <div className="lado-esquerdoProfissional">
        <div className="titulo-logo">
          <p className="titulo-cadastro">Bem vindo de volta!</p>
          <img
            src={logo}
            alt="Future Mind Logo"
            className="logo-paraCadastro"
          />
        </div>
        <div className="inputs-login-div">
          <div className="login-input">
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
              E-mail deve terminar com @gmail.com ou @hotmail.com
            </span>
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
            <span className={`erro ${senhaValido ? "visivel" : ""}`}>
              Mínimo 8 caracteres
            </span>
            <img
              src={tipoIconSenha}
              alt="Mostrar senha"
              className="icone-senha-login"
              onClick={alternarTipo}
            />
          </div>
        </div>
        <div className="container_button_login">
          <button className="botao-login" onClick={handleCadastro}>
             Realizar Login
          </button>
        </div>
        
        <p className="login-texto">
          Ainda não possui cadastro?
          <a
            href="/cadastroprofissional1"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          >
            Profissional
          </a>{" "}
          ou
          <a
            href="/cadastroPaciente"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          >
            Paciente
          </a>
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

export default login;
