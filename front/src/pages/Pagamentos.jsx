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
    const [pagina, setPagina] = useState(<Debito />);
    const [metodoSelecionado, setMetodoSelecionado] = useState("debito");

    const selectPag = (metodo, componente) => {
        setPagina(componente);
        setMetodoSelecionado(metodo);
    };

    return (
        <div className="pagamento-container">
            <div className="lado-esquerdo">
                <div className='pagamento-pSuperior'>
                    <img src={seta} alt="" className='seta-pagamento' />
                    <h3 className='h3'>Juan Silva</h3>
                </div>
                <div className='frase-motivadora'>
                    <h2 className='style-fraseM'>Seu bem-estar começa aqui!</h2>
                </div>
                <div className='valor-de-pagamento'>
                    <h3 className='valor-DPagamento'>Valor Total:</h3>
                    <h3 className='valor-DPagamento'>R$50,00</h3>
                </div>
                <div className='dados-de-consultaPag'>
                    <p className='style-dadosPag'>Dados da Consulta</p>
                    <div className='sub-dadosPag'>
                        <h2 className='nome-profissionalPag'>
                            Dr. Juan Pereira Silveiro  
                        </h2>
                        <h3>12/08 - às 18h até 19h</h3>
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
                    <button 
                        className={`botoesPag-style ${metodoSelecionado === "debito" ? "selected" : ""}`} 
                        onClick={() => selectPag("debito", <Debito />)}
                    > 
                        <img src={cartao} alt="" className='formPag'/>Cartão de Débito
                    </button>
                    <button 
                        className={`botoesPag-style ${metodoSelecionado === "credito" ? "selected" : ""}`} 
                        onClick={() => selectPag("credito", <Credito />)}
                    >
                        <img src={cartao} alt="" className='formPag'/>Cartão de Crédito
                    </button>
                    <button 
                        className={`botoesPag-style ${metodoSelecionado === "pix" ? "selected" : ""}`} 
                        onClick={() => selectPag("pix", <Pix />)}
                    >
                        <img src={pix} alt="" className='formPag' />Pix
                    </button>
                    <button 
                        className={`botoesPag-style ${metodoSelecionado === "boleto" ? "selected" : ""}`} 
                        onClick={() => selectPag("boleto", <Boleto />)}
                    >
                        <img src={boleto} alt="" className='formPag' />Boleto
                    </button>
                </div>
                <div>
                    {pagina}
                </div>
            </div>
        </div>
    );
}

export default Pagamento;
