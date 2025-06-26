import { useNavigate } from "react-router-dom";
import logo from "../assets/logoCadastro2.svg";
import imagem from "../assets/FotoCadastro.svg";
import "./CSS/Cadastros.css";
import { useContext, useState } from "react";
import { GlobalContext } from "../Context/GlobalContext";


function Login() {
  const navigate = useNavigate();
  const { setUserLogado, setUser, setPaginaAnterior } = useContext(GlobalContext);

  const [valorEmail, setValorEmail] = useState("");
  const [valorSenha, setValorSenha] = useState("");
  
  const [emailValido, setEmailValido] = useState(false);
  const [senhaValido, setSenhaValido] = useState(false);

  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState("icon_nao_ver.png");
  
  const [mensagemSenha, setMensagemSenha] = useState("")
  const [mensagemEmail, setMensagemEmail] = useState("")

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
      const response = await fetch(
        "https://futuremind-2-0.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      
      if (response.ok) {
        const data = await response.json();
        setUserLogado(true);
        setUser(data);
        setPaginaAnterior('Login');
        navigate("/inicio");
      } else {
        
        const data = await response.json();
        console.log(data);  
        
        if(data == 'Paciente não encontrado' || data == 'Profissional não encontrado'){
          
           setEmailValido(true)
           setMensagemEmail('Email não cadastrado!')
           setSenhaValido(true)
           setMensagemSenha('')

        }else{
           
          setEmailValido(false)
          setMensagemEmail('')

        }

        if(data == 'Senha incorreta'){
         
          setSenhaValido(true)
          setMensagemSenha('senha incorreta!')
          
        }
      }

    } catch (err) {
      console.log("Erro no servidor", err);
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
            <label>E-mail ou e-mail profissional</label>
            <span className={`com_erros ${!emailValido ? "sem_erro" : ""}`}>
              {mensagemEmail}
            </span>
          </div>

          <div className="login-input">
            <input
              type={tipoInput}
              value={valorSenha}
              maxLength={8}
              onChange={(e) => {
                setValorSenha(e.target.value);
                setSenhaValido(false);
              }}
              placeholder=" "
              required
            />
            <label>Senha</label>
            <span className={`com_erros ${!senhaValido ? "sem_erro" : ""}`}>
              {mensagemSenha}
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
          <button className="botao-login" onClick={handleLogin}>
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
          </a>
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

export default Login;
