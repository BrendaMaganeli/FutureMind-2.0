import './CSS/DiarioEmocional.css'
import seta from '../assets/reply-solid (1) 2.svg'
import Nota from '../assets/file-pen-solid 1.svg'
import Arvore from '../assets/Logo Para o Navegador do Google 4.svg'
import Relógio from '../assets/clock-regular 1.svg'

function DiarioEmocional() {
  return (
    <div className='container-diarioemocional'>
        <div className='mini-lado-esquerdoDiario'>
            <button className='buttondiario'><img src={seta} alt="" className='seta-diario'/></button>
        </div>

        <div className='lado-esquerdoDiario'>
            <div className='div-cabecalhodiario'>
                <div className='cacecalhomenor'>
                  <h2>Diário Emocional</h2>
                  <button className='botaonovanota'><img src={Nota} alt="" />Nova Nota</button>
                </div>
                <p className='quantidadenotas'>10 notas</p>
            </div>
            <div>

            </div>
        </div>

        <div className='lado-direitoDiario'>
            <img src={Arvore} alt="" className='arvoredefundodiario'/>
            <div className='cabecalhonota'>
                <p><img src={Relógio} alt="" className='relogio'/>12/10/2025</p>
                <div className='div-buts'>
                  <button>Apagar Nota</button>
                  <button>Compartilhar</button>
                  <button>a</button>
                </div>
            </div>
            <div className=''>

            </div>
        </div>
    </div>
  )
}

export default DiarioEmocional