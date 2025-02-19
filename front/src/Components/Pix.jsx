import qrCode from "../assets/qrCode.webp"
import './CSS/Pix.css'

function Pix() {
  return (
    <div className="container-pix">
      <div className='infopix'>
        <div className="qrcode-texto">
        <img src={qrCode} alt="" className="qrCode"/>
        <div className="texto-Lqrcode">
        <p>
        1. Entre no aplicativo da sua instituição financeira e acesse o ambiente Pix;
        </p>
        <p>
        2. Escolha a opção de Ler o QR Code;
        </p>
        <p>
        3. Escaneie o QR Code;
        </p>
        <p>
        4. Confirme as informações e confirme o pagamento.
        </p>
        </div>
        </div>
        <p>Informações do Pix</p>
        <input type="number" placeholder='Brenda Maganeli Casimiro' className='input-pix' readOnly/>
      </div>
      <div className='infopix-men'>
          <input type="number" placeholder='xxx.xxx.xxx.xx' className='input-pixMen' readOnly/>
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

export default Pix