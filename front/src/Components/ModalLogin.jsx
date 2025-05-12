import { useNavigate } from "react-router-dom";
import './CSS/ModalLogin.css';

function ModalLogin({setMostrarModalLogin}) {

    const navigate = useNavigate();
    
  return (
    <div className="modal-login-overlay">
    <div className="modal-login">
      <h2>Você precisa estar logado para acessar essa funcionalidade</h2>
      <div className="buttons">
          <button onClick={() => navigate("/login")}>Ir para Login</button>
          <button onClick={() => setMostrarModalLogin(false)}>Cancelar</button>
      </div>
    </div>
  </div>
  )
};

export default ModalLogin;