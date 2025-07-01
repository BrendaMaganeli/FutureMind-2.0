import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const inputRef = useRef(null);

  const DOMINIO = "@futuremind.com.br";

  const [especializacoes, setEspecializacoes] = useState(profissional.especializacao || "");
  const [abordagens, setAbordagens] = useState(profissional.abordagem || "");
  const [valorEmail, setValorEmail] = useState(profissional.email || "");
  const [valorSenha, setValorSenha] = useState(profissional.senha || "");
  const [prefixoEmailProfissional, setPrefixoEmailProfissional] = useState(profissional.email_profissional || "");

  const [espValidado, setEspValidado] = useState(false);
  const [aboValidado, setAboValidado] = useState(false);
  const [emailValidado, setEmailValidado] = useState(false);
  const [senhaValidado, setSenhaValidado] = useState(false);
  const [usuarioValidado, setUsuarioValido] = useState(false);
  const [mensagemEmail, setMensagemEmail] = useState("");
  const [usuarioMensgaem, setMensagemUsuario] = useState("");

  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState("view (1).png");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [checkboxInvalido, setCheckboxInvalido] = useState(false);
  const [caretPos, setCaretPos] = useState(null);

  useEffect(() => {
    setProfissional(prev => ({
      ...prev,
      email_profissional: `${prefixoEmailProfissional}${DOMINIO}`
    }));
  }, [prefixoEmailProfissional]);

  useLayoutEffect(() => {
    if (inputRef.current != null && caretPos !== null) {
      inputRef.current.setSelectionRange(caretPos, caretPos);
    }
  }, [prefixoEmailProfissional, caretPos]);

  useEffect(() => {
    setProfissional(prev => ({
      ...prev,
      especializacao: JSON.stringify(especializacoes)
    }));
  }, [especializacoes]);

  useEffect(() => {
    setProfissional(prev => ({
      ...prev,
      abordagem: JSON.stringify(abordagens)
    }));
  }, [abordagens]);

  useEffect(() => {
    setProfissional(prev => ({ ...prev, email: valorEmail }));
  }, [valorEmail]);

  useEffect(() => {
    setProfissional(prev => ({ ...prev, senha: valorSenha }));
  }, [valorSenha]);

  const handlePrefixoChange = (e) => {
    let val = e.target.value;
    if (val.endsWith(DOMINIO)) val = val.slice(0, -DOMINIO?.length);
    if (val.includes("@")) return;

    setCaretPos(e.target.selectionStart);
    setPrefixoEmailProfissional(val);
  };

  const indentificadorEmail = (e) => setValorEmail(e.target.value);
  const indentificadorSenha = (e) => setValorSenha(e.target.value);

  const alternarTipo = () => {
    setTipoInput(prev => prev === "password" ? "text" : "password");
    setTipoIconSenha(prev => prev === "hide.png" ? "view (1).png" : "hide.png");
  };

  useEffect(() => {
    if (especializacoes?.length > 0) setEspValidado(false);
  }, [especializacoes]);

  useEffect(() => {
    if (abordagens?.length > 0) setAboValidado(false);
  }, [abordagens]);

  useEffect(() => {
    setEmailValidado(false);
  }, [valorEmail]);

  useEffect(() => {
    setSenhaValidado(false);
  }, [valorSenha]);

  useEffect(() => {
    setUsuarioValido(false);
  }, [prefixoEmailProfissional]);

  const handleCadastro = async () => {
    let erro = false;
    let data;

    try {
      const response = await fetch("http://localhost:4242/verificar_profissional_dois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valorEmail,
          email_profissional: `${prefixoEmailProfissional}${DOMINIO}`
        }),
      });

      if (response.ok) data = await response.json();
      else return console.error("Erro na verificação do profissional");
    } catch (error) {
      return console.error("Erro na requisição:", error);
    }

    if (especializacoes?.length === 0) {
      setEspValidado(true);
      erro = true;
    }

    if (abordagens?.length === 0) {
      setAboValidado(true);
      erro = true;
    }

    if (!valorEmail.includes("@gmail.com") && !valorEmail.includes("@hotmail.com")) {
      setEmailValidado(true);
      setMensagemEmail("Use um email válido!");
      erro = true;
    } else if (data.emailExisteProf) {
      setEmailValidado(true);
      setMensagemEmail("Email já cadastrado!");
      erro = true;
    } else {
      setEmailValidado(false);
      setMensagemEmail("");
    }

    if (valorSenha?.length !== 8) {
      setSenhaValidado(true);
      erro = true;
    } else setSenhaValidado(false);

    if (!prefixoEmailProfissional.includes(".")) {
      setMensagemUsuario('Seu usuário deve conter um "." antes do "@" !');
      setUsuarioValido(true);
      erro = true;
    } else if (data.usuarioExisteProf) {
      setMensagemUsuario("Usuário já cadastrado!");
      setUsuarioValido(true);
      erro = true;
    } else {
      setUsuarioValido(false);
      setMensagemUsuario("");
    }

    if (!aceitouTermos) {
      setCheckboxInvalido(false);
      setTimeout(() => setCheckboxInvalido(true), 10);
      erro = true;
    }

    if (!erro) {
      try {
        const response = await fetch("http://localhost:4242/cadastro-profissional", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profissional),
        });

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
          <img src={logo} alt="Future Mind Logo" className="logo-paraCadastro" />
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
              onChange={(opcoes) => setEspecializacoes(opcoes || [])}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <div className={`com_erros ${!espValidado ? "sem_erro" : ""}`}>
              Selecione no minimo uma especialização
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
              onChange={(opcoes) => setAbordagens(opcoes || [])}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <div className={`com_erros ${!aboValidado ? "sem_erro" : ""}`}>
              Selecione no minimo uma abordagem
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
              <div className={`com_erros ${!emailValidado ? "sem_erro" : ""}`}>
                {mensagemEmail}
              </div>
            </div>

            <div className="cadastro-input">
              <input
                type={tipoInput}
                value={valorSenha}
                onChange={indentificadorSenha}
                placeholder=" "
                required
                maxLength={8}
              />
              <label>Senha</label>
              <img
                src={tipoIconSenha}
                alt="Mostrar senha"
                className="icone-senha"
                onClick={alternarTipo}
              />
              <div className={`com_erros ${!senhaValidado ? "sem_erro" : ""}`}>
                senha deve ter 8 caracteres!
              </div>
            </div>
          </div>

          <div className="cadastro-input">
            <input
              type="text"
              value={prefixoEmailProfissional ? `${prefixoEmailProfissional}${DOMINIO}` : ""}
              onChange={handlePrefixoChange}
              ref={inputRef}
              placeholder=" "
              required
            />
            <label>Usuário</label>
            <div className={`com_erros_usuario ${!usuarioValidado ? "sem_erro_usuario" : ""}`}>
              {usuarioMensgaem}
            </div>
          </div>
        </div>

        <div className="div-check-profissional">
          <div className="container_styles-check">
            <input
              className={`styles-check ${checkboxInvalido ? "tremer" : ""}`}
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => {
                setAceitouTermos(e.target.checked);
                setCheckboxInvalido(false);
              }}
            />
          </div>
          <div className="container_text_termos">
            <label className="termos-styles">Aceitar os</label>{" "}
            <a className="termos-a" href="/termo">termos</a>{" "}
            <label className="de_uso">de uso</label>
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
        <img src={imagem} alt="Cadastro Profissional" className="imagem-cadastro" />
      </div>
    </div>
  );
}

export default CadastroProfissional2;