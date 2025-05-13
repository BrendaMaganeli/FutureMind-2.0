import { useState } from "react";

function InputSenha({ value, onChange, erroVisivel, label }) {
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

  return (
    <div className="cadastro-input">
      <input
        type={tipoInput}
        value={value}
        onChange={onChange}
        placeholder=""
        required
      />
      <label>{label}</label>
      <span className={`erro ${erroVisivel ? "visivel" : ""}`}>
        Mínimo 8 caracteres
      </span>
      <img
        src={tipoIconSenha}
        alt="Mostrar senha"
        className="icone-senha"
        onClick={alternarTipo}
      />
    </div>
  );
}

export default InputSenha;
