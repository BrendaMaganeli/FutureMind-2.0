import codigoBarras from '../assets/codeBarra.jpg'
import './CSS/Boleto.css'

function Boleto() {
  return (
    <div className="container-boleto">
      <div className='move-codeBarras'>
        <img src={codigoBarras} alt="" className='img-codigoBarras' />
      </div>

      <div className='infopix'>
        <p>Informações do Boleto</p>
        <input type="number" placeholder='Brenda Maganeli Casimiro' className='input-pix' readOnly/>
      </div>
      <div className='infopix-men'>
          <input type="number" placeholder='12/2025' className='input-pixMen' readOnly/>
          <input type="number" placeholder='R$50,00' className='input-pixMen' readOnly/>
      </div>
      <div className="anexo-comp">
        <input type="file" placeholder='Anexe seu comprovante aqui' className='input-com'/>
      </div>
      <div className='botaoPag'>
        <button className='botaoPag-styles'>Concluir</button>
      </div>
    </div>
  )
}

export default Boleto