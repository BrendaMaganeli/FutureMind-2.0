import './CSS/Pagamento.css'
import seta from '../assets/seta.svg'
import logoHorizontal from '../assets/logoHorizontal.svg'
import { Link } from 'react-router-dom'

function Pagamento() {
  return (
    <div className="pagamento-container">

        <div className="lado-esquerdo">
            <div className='pagamento-pSuperior'>
             <img src={seta} alt=""  className='seta-pagamento'/>   
                <h3 className='h3'>Juan silva</h3>
            </div>
            <div className='frase-motivadora'>
                <h2 className='style-fraseM'>Seu bem-estar começa aqui!</h2>
            </div>
            <div className='valor-de-pagamento'>
                <h2 className='valor-DPagamento'>Valor Total:</h2>
                <h2 className='valor-DPagamento'>R$50,00</h2>
            </div>
            <div className='dados-de-consultaPag'>
                <h2 className='style-dadosPag'>Dados da Consulta</h2>
                <div className='sub-dadosPag'>
                <h2 className='nome-profissionalPag'>
                    Dr. Juan Pereira Silveiro  
                </h2>
                <h3>
                    12/08 - ás 18h até 19h
                </h3>
                </div>
            </div>
            <div className='linkPag-politica'>
                <Link className='style-linkPag' to='/politica'>Futuremind | política de privacidade</Link>
            </div>
        </div>

        <div className="lado-Direito">
            
            <div>
                <img src={logoHorizontal} alt="" />
            </div>

       </div>

    </div>
  )
}

export default Pagamento