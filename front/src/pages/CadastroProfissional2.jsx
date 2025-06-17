import { useNavigate } from "react-router-dom";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Select from "react-select";
import { GlobalContext } from "../Context/GlobalContext";
import logo from "../assets/logoCadastro2.svg";
import imagem from "../assets/FotoCadastro.svg";
import "./CSS/Cadastros.css";

const opcoesEspecializacao = [
  { value: "psicologia-clinica", label: "Psicologia Clínica" },
  { value: "psicopedagogia", label: "Psicopedagogia" },
  { value: "neuropsicologia", label: "Neuropsicologia" },
];

const opcoesAbordagens = [
  { value: "cognitivo-comportamental", label: "Cognitivo-Comportamental" },
  { value: "psicanalise", label: "Psicanálise" },
  { value: "humanista", label: "Humanista" },
];

function CadastroProfissional2() {
  const navigate = useNavigate();
  const { profissional, setProfissional } = useContext(GlobalContext);

  const [especializacoes, setEspecializacoes] = useState(
    profissional.especializacao || "[]"
  );
  const [abordagens, setAbordagens] = useState(profissional.abordagemn || "[]");
  const [valorEmail, setValorEmail] = useState(profissional.email);
  const [valorSenha, setValorSenha] = useState(profissional.senha);
  const [prefixoEmailProfissional, setPrefixoEmailProfissional] = useState(
    profissional.email_profissional
  );

  const [especializacaoValida, setEspecializacaoValida] = useState(true);
  const [abordagemValida, setAbordagemValida] = useState(true);
  const [emailValido, setEmailValido] = useState(false);
  const [senhaValido, setSenhaValido] = useState(false);
  const [erroAbordagem, setErroAbordagem] = useState(false);
  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState("icon_nao_ver.png");

  const inputRef = useRef(null);
  const [caretPos, setCaretPos] = useState(null);

  const [emailMensagem, setEmailMensagem] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [erroUsuario, setErroUsuario] = useState(false);
  const [mensagemErroUsuario, setMensagemErroUsuario] = useState("");

  const [erroEspecializacao, setErroEspecializacao] = useState(false);

  const DOMINIO = "@futuremind.com.br";

  useEffect(() => {
    setProfissional((prev) => ({
      ...prev,
      email_profissional: `${prefixoEmailProfissional}${DOMINIO}`,
    }));
  }, [prefixoEmailProfissional]);

  useLayoutEffect(() => {
    if (inputRef.current != null && caretPos !== null) {
      inputRef.current.setSelectionRange(caretPos, caretPos);
    }
  }, [prefixoEmailProfissional, caretPos]);

  useEffect(() => {
    setProfissional((prev) => ({
      ...prev,
      especializacao: especializacoes,
    }));
  }, [especializacoes]);

  useEffect(() => {
    setProfissional((prev) => ({
      ...prev,
      abordagem: abordagens,
    }));
  }, [abordagens]);

  useEffect(() => {
    setProfissional((prev) => ({ ...prev, email: valorEmail }));
  }, [valorEmail]);

  useEffect(() => {
    setProfissional((prev) => ({ ...prev, senha: valorSenha }));
  }, [valorSenha]);

  const handlePrefixoChange = (e) => {
    let val = e.target.value;
    if (val.endsWith(DOMINIO)) val = val.slice(0, -DOMINIO.length);
    if (val.includes("@")) return;

    setCaretPos(e.target.selectionStart);
    setPrefixoEmailProfissional(val);
  };

  const indentificadorEmail = (e) => {
    const valor = e.target.value;
    setValorEmail(valor);
    setEmailValido(
      !(valor.trim().endsWith("@gmail.com") || valor.endsWith("@hotmail.com"))
    );
  };

  const indentificadorSenha = (e) => {
    const valor = e.target.value;
    setValorSenha(valor);
    setSenhaValido(valor.trim().length < 8);
  };

  const alternarTipo = () => {
    setTipoInput((prev) => (prev === "password" ? "text" : "password"));
    setTipoIconSenha((prev) =>
      prev === "icon_nao_ver.png" ? "icon_ver.png" : "icon_nao_ver.png"
    );
  };

  const handleCadastro = async () => {
    let erro = false;

    let data;
    try {
      const response = await fetch(
        "http://localhost:4242/verificar_profissional_dois",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            valorEmail,
            email_profissional: prefixoEmailProfissional,
          }),
        }
      );

      if (response.ok) {
        data = await response.json();
      } else {
        console.error("Erro na verificação do profissional");
        return;
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      return;
    }

    // Só aqui faça as validações (depois de ter `data`)
    if (!especializacoes || especializacoes.length === 0) {
      setErroEspecializacao(true);
      erro = true;
    } else {
      setErroEspecializacao(false);
    }

    if (!abordagens || abordagens.length === 0) {
      setErroAbordagem(true);
      erro = true;
    } else {
      setErroAbordagem(false);
    }

    if (
      !valorEmail?.trim().endsWith("@gmail.com") &&
      !valorEmail?.endsWith("@hotmail.com")
    ) {
      setEmailValido(true);
      setEmailMensagem("E-mail deve terminar com @gmail.com ou @hotmail.com");
      erro = true;
    } else if (data?.emailExisteProf) {
      setEmailValido(true);
      setEmailMensagem("Email já cadastrado!");
      erro = true;
    } else {
      setEmailValido(false);
      setEmailMensagem("");
    }

    if (
      !prefixoEmailProfissional.includes(".") ||
      prefixoEmailProfissional.includes("@") ||
      prefixoEmailProfissional.length < 1
    ) {
      setErroUsuario(true);
      setMensagemErroUsuario("Nome de usuário deve conter um '.'");
      erro = true;
    } else if (data?.usuarioExisteProf) {
      setErroUsuario(true);
      setMensagemErroUsuario("Usuário já cadastrado!");
      erro = true;
    } else {
      setErroUsuario(false);
      setMensagemErroUsuario("");
    }

    if (valorSenha.trim().length < 8) {
      setErroSenha(true);
      erro = true;
    } else {
      setErroSenha(false);
    }
    console.log("Dados atuais:", {
      especializacoes,
      abordagens,
      valorEmail,
      valorSenha,
      prefixoEmailProfissional,
    });

    // Só envia se não houve erros
    if (!erro) {
      try {
        const response = await fetch(
          "https://futuremind-2-0-mw60.onrender.com/cadastro-profissional",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profissional),
          }
        );

        if (response.ok) {
          setProfissional({
            nome: "",
            cpf: "",
            telefone: "",
            data_nascimento: "",
            especializacao: [],
            senha: "",
            foto: "../assets/icon-profile.svg",
            abordagem: [],
            email: "",
            email_profissional: "@futuremind.com",
            crp: "",
            valor_consulta: null,
          });
          navigate("/login");
        }
        console.log("Dados atuais:", {
          especializacoes,
          abordagens,
          valorEmail,
          valorSenha,
          prefixoEmailProfissional,
        });
      } catch (err) {
        console.log("Erro ao cadastrar profissional:", err);
      }
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

        <div className="inputs-cadastro-divP">
          <div className="input-cadastro">
            <label className="label-input">Especialização</label>
            <Select
              className="custom-react-select"
              classNamePrefix="select"
              value={especializacoes}
              options={opcoesEspecializacao}
              isMulti
              onChange={(opcoes) => {
                setEspecializacoes(opcoes || []);
                setEspecializacaoValida((opcoes || []).length > 0);
              }}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <div
              className={`container_alerta_nulo ${erroEspecializacao ? "container_geral_mostra" : ""}`}
            >
              <p>Selecione pelo menos uma especialização.</p>
            </div>
          </div>

          <div className="input-cadastro">
            <label className="label-input">Abordagens</label>
            <Select
              className="custom-react-select"
              classNamePrefix="select"
              value={abordagens}
              options={opcoesAbordagens}
              isMulti
              onChange={(opcoes) => {
                setAbordagens(opcoes || []);
                setAbordagemValida((opcoes || []).length > 0);
              }}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <div
              className={`container_alerta_nulo ${erroAbordagem ? "container_geral_mostra" : ""}`}
            >
              <p>Selecione pelo menos uma abordagem.</p>
            </div>
          </div>

          <div className="input-lados">
            <div className="cadastro-input">
              <input
                type="text"
                value={valorEmail}
                onChange={indentificadorEmail}
                placeholder=" "
                required
              />
              <label>E-mail</label>
              <span className={`erro ${emailValido ? "visivel" : ""}`}>
                {emailMensagem}
              </span>
            </div>

            <div className="cadastro-input">
              <input
                type={tipoInput}
                value={valorSenha}
                onChange={indentificadorSenha}
                placeholder=" "
                required
              />
              <label>Senha</label>
              <span className={`erro ${erroSenha ? "visivel" : ""}`}>
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

          <div className="cadastro-input">
            <input
              type="text"
              value={
                prefixoEmailProfissional
                  ? `${prefixoEmailProfissional}${DOMINIO}`
                  : ""
              }
              onChange={handlePrefixoChange}
              ref={inputRef}
              placeholder=" "
              required
            />
            <label>Usuário</label>
            <span className={`erro ${erroUsuario ? "visivel" : ""}`}>
              {mensagemErroUsuario}
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

export default CadastroProfissional2;
