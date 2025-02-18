import './CSS/Debito.css'

function Debito() {
  return (
    <div className='container-debito'>
      <div className='infoCard'>
        <p>Informações do Cartão</p>
        <input type="number" placeholder='Número do cartão' className='input-debito'/>
        <div className='infoCard-men'>
          <input type="number" placeholder='YY/MM' className='input-debitoMen'/>
          <input type="number" placeholder='CVV' className='input-debitoMen'/>
        </div>
      </div>
      <div className='inforegiao'>
        <p>País ou Região</p>
      <input type="text" className='input-debito'/>
      </div>
      <div className='infoemail'>
        <p>E-mail</p>
      <input type="text" placeholder='xxxxxx@gmail.com' className='input-debito'/>
      </div>
      <div className='salvarcheckbox'>
      <input type="checkbox" id="checkpag" className='checkpag' />
      <label htmlFor="checkpag"></label>
      <p>Salvar informações para próxima consulta</p>
    </div>

      <div className='botaoPag'>
        <button className='botaoPag-styles'>Concluir</button>
      </div>
    </div>
  )
}

export default Debito