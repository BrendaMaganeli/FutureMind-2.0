import './CSS/ModalLogin.css';

function ModalSair({setMostrarModalSair, setMostrarModalCadastro}) {

    const sairConta = () => {

        localStorage.removeItem('User-Profile');
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