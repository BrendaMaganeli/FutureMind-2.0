import './CSS/Pagamento.css'
import seta from '../assets/seta.svg'
import logoHorizontal from '../assets/logoHorizontal.svg'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Debito from '../Components/Debito'
import Credito from '../Components/Credito'
import Pix from '../Components/Pix'
import Boleto from '../Components/Boleto'
import cartao from '../assets/cartao.webp'
import boleto from '../assets/images 1.svg'
import pix from '../assets/download 3.svg'

function Pagamento() {

    const [pagina,setPagina] = useState(<Debito />)

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
            
            <div className='logoPag'>
                <img src={logoHorizontal} alt="" />
            </div>
            <div className='botoesPag'>
                <button onClick={ () => {setPagina(<Debito />)} }> <img src={cartao} alt="" className='cartao'/></button>
                <button onClick={ () => {setPagina(<Credito />)}}><img src={cartao} alt="" className='cartao'/></button>
                <button onClick={ () => {setPagina(<Pix />)}}><img src={pix} alt="" /></button>
                <button onClick={ () => {setPagina(<Boleto />)}}><img src={boleto} alt="" /></button>
            </div>
            <div>
                {pagina}
            </div>

       </div>

    </div>
  )
}

export default Pagamento