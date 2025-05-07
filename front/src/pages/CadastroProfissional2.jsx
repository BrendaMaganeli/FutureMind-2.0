<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import Select from "react-select";
import { useState } from "react";
import logo from "../assets/logoCadastro2.svg";
import imagem from "../assets/FotoCadastro.svg";
import "./CSS/Cadastros.css";
=======
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import Select from 'react-select';
import { useState } from 'react';
import logo from '../assets/logoCadastro2.svg';
import imagem from '../assets/FotoCadastro.svg';
import './CSS/Cadastros.css';
import voltar from '../assets/seta-principal.svg';
>>>>>>> e457da2bbc5d810dfb705faf925f5151e808dd59

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
  const navigate = useNavigate(); // Hook para navegação
  const { profissional, setProfissional } = useContext(GlobalContext);
  const [especializacoes, setEspecializacoes] = useState(
    profissional.especializacao,
  );
  const [abordagens, setAbordagens] = useState(profissional.abordagem);
  const [especializacaoValida, setEspecializacaoValida] = useState(true);
  const [abordagemValida, setAbordagemValida] = useState(true);
  const [emailValido, setEmailValido] = useState();
  const [senhaValido, setSenhaValido] = useState();
  const [valorEmail, setValorEmail] = useState(profissional.email);
  const [valorSenha, setValorSenha] = useState(profissional.senha);
  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIconSenha, setTipoIconSenha] = useState("icon_nao_ver.png");
  const [prefixoEmailProfissional, setPrefixoEmailProfissional] = useState(
    profissional.email_profissional,
  );
  const [prefixoEmailProfissionalValido, setPrefixoEmailProfissionalValido] =
    useState();
  const inputRef = useRef(null);
  const [caretPos, setCaretPos] = useState(null);
  const DOMINIO = "@futuremind.com.br";

  // Sincroniza com o ctx
  useEffect(() => {
    setProfissional((prev) => ({
      ...prev,
      email_profissional: `${prefixoEmailProfissional}${DOMINIO}`,
    }));
  }, [prefixoEmailProfissional]);

  // Depois de cada re-render, reposiciona o cursor
  useLayoutEffect(() => {
    if (inputRef.current != null && caretPos !== null) {
      inputRef.current.setSelectionRange(caretPos, caretPos);
    }
  }, [prefixoEmailProfissional, caretPos]);

  // onChange customizado
  const handlePrefixoChange = (e) => {
    let val = e.target.value;
    // remove qualquer domínio “colado”
    if (val.endsWith(DOMINIO)) {
      val = val.slice(0, -DOMINIO.length);
    }
    // bloqueia o “@”
    if (val.includes("@")) return;

    // guarda onde tava o cursor
    setCaretPos(e.target.selectionStart);
    setPrefixoEmailProfissional(val);
  };

  useEffect(() => {
    setProfissional((prev) => ({
      ...prev,
      especializacao: JSON.stringify(especializacoes),
    }));
  }, [especializacoes]);

  useEffect(() => {
    setProfissional((prev) => ({
      ...prev,
      abordagem: JSON.stringify(abordagens),
    }));
  }, [abordagens]);

  useEffect(() => {
    setProfissional((prev) => ({ ...prev, email: valorEmail }));
  }, [valorEmail]);

  useEffect(() => {
    setProfissional((prev) => ({ ...prev, senha: valorSenha }));
  }, [valorSenha]);

  const handleCadastro = () => {
    let erro = false;

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

    if (
      !valorEmail?.trim().endsWith("@gmail.com") &&
      !valorEmail?.endsWith("@hotmail.com")
    ) {
      setEmailValido(true);
      erro = true;
    } else {
      setEmailValido(false);
    }

    if (
      !prefixoEmailProfissional.includes(".") ||
      prefixoEmailProfissional.includes("@")
    ) {
      setPrefixoEmailProfissionalValido(true);
      erro = true;
    } else {
      setPrefixoEmailProfissionalValido(false);
    }

    if (!valorSenha || valorSenha.trim().length < 8) {
      setSenhaValido(true);
      erro = true;
    } else {
      setSenhaValido(false);
    }

    if (!erro) {
      req();
    }
  };

  const indentificadorEmail = (e) => {
    let valor_email = e.target.value;
    setValorEmail(valor_email);
    if (
      valor_email.trim().endsWith("@gmail.com") ||
      valor_email.endsWith("@gmail.com")
    ) {
      setEmailValido(false);
    } else {
      setEmailValido(true);
    }
  };

  const indentificadorSenha = (e) => {
    let valor_senha = e.target.value;
    setValorSenha(valor_senha);
    if (valor_senha.trim().length >= 8) {
      setSenhaValido(false);
    } else {
      setSenhaValido(true);
    }
  };

  const alternarTipo = () => {
    if (tipoInput == "password") {
      setTipoInput("text");
      setTipoIconSenha("icon_ver.png");
    } else {
      setTipoInput("password");
      setTipoIconSenha("icon_nao_ver.png");
    }
  };

  const req = async () => {
    try {
      const response = await fetch(
        "http://localhost:4242/cadastro-profissional",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profissional),
        },
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
          valor_consulta: 0.0,
        });
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
<<<<<<< HEAD
    <div className="container-profissional">
      <div className="lado-esquerdoProfissional">
        <div className="titulo-logo">
          <p className="titulo-cadastro">Cadastro Profissional</p>
          <img
            src={logo}
            alt="Future Mind Logo"
            className="logo-paraCadastro"
          />
=======
    <div className='container-profissional'>
      <div className='lado-esquerdoProfissional'>
        <div className='titulo-logo'>
        <button className="back-button-pt" >
      <img src={voltar} alt="" style={{width: '3em'}} />
      </button>
          <p className='titulo-cadastro'>Cadastro Profissional</p>
          <img src={logo} alt='Future Mind Logo' className='logo-paraCadastro' />
>>>>>>> e457da2bbc5d810dfb705faf925f5151e808dd59
        </div>
        <div className="inputs-cadastro-divP">
          <div className="input-cadastro">
            <label className="label-input">Especialização</label>
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
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <div
              className={`container_alerta_nulo ${!especializacaoValida ? "container_geral_mostra" : ""}`}
            >
              <p>Selecione pelo menos uma especialização.</p>
            </div>
          </div>

          <div className="input-cadastro">
            <label className="label-input">Abordagens</label>
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
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <div
              className={`container_alerta_nulo ${!abordagemValida ? "container_geral_mostra" : ""}`}
            >
              <p>Selecione pelo menos uma abordagem.</p>
            </div>
          </div>
          <div className="input-lados">
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
                E-mail deve terminar com @gmail.com ou @hotmail.com
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
            <span
              className={`erro ${prefixoEmailProfissionalValido ? "visivel" : ""}`}
            >
              Seu usuário deve ter um "." e não deve conter "@"
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
