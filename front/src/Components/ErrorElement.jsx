import './CSS/ErrorElement.css';
import { useNavigate } from "react-router-dom";

function ErrorElement() {

  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="lado-esquerdo-error">
        <div className="text-maior-container">
          <h1 className="text-maior">
            Erro nas rotas
          </h1>
        </div>
          <div className="text-menor-container">
            <p className="text-menor">
              O link que você utilizou está desatualizado!
            </p>
            <p className="text-menor">
              Volte a navegar em nosso site!
            </p>
          </div>
          <div className="button-voltar">
            <button onClick={() => { navigate('/') }} className="voltar-btn">
              Voltar
            </button>
          </div>
      </div>
      <div className="lado-direito-error">
        <div className="div-img-error">
          <img src="errorelementimg.png" alt="" className="img-error" />
        </div>
      </div>      
    </div>
  )
}



export default ErrorElement;