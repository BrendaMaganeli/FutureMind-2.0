import { useContext } from 'react';
import './CSS/ModalLogin.css';
import { GlobalContext } from '../Context/GlobalContext';

function ModalSair({setMostrarModalSair, setMostrarModalCadastro}) {

    const { setUser } = useContext(GlobalContext);

    const sairConta = () => {

        setUser(null);
        setMostrarModalSair(false);
        setMostrarModalCadastro(true);
    }
    
  return (
    <div className="modal-login-overlay">
    <div className="modal-login">
      <h2>Tem certeza que deseja sair da sua conta?</h2>
      <div className="buttons">
          <button onClick={sairConta}>Sim</button>
          <button onClick={() => setMostrarModalSair(false)}>Cancelar</button>
      </div>
    </div>
  </div>
  )
};

export default ModalSair;