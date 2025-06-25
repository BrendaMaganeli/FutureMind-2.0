import { useNavigate } from "react-router-dom";
import './CSS/ModalLogin.css';
import { useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";

function ModalUserProfi({setMostrarModalUserProfi}) {

    const navigate = useNavigate();
    const { setUser } = useContext(GlobalContext);
    
  return (
    <div className="modal-login-overlay">
    <div className="modal-login">
      <h2>É necessário estar logado como paciente para acessar essa funcionalidade</h2>
      <div className="buttons">
          <button onClick={() => { setUser(null); navigate("/cadastroPaciente"); }}>Criar uma conta como paciente</button>
          <button onClick={() => setMostrarModalUserProfi(false)}>Cancelar</button>
      </div>
    </div>
  </div>
  )
};

export default ModalUserProfi;