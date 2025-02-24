
import mulher from '../assets/image 8.png';
import icon_um from '../assets/agenda 2.svg';
import icon_dois from '../assets/cam-recorder (1) 11.svg';
import icon_tres from '../assets/icons8-bate-papo-48 2.svg';
import icon_quatro from '../assets/icons8-pagamento-50 (1) 2.svg';

function EditarProfissional() {
  return (
    <div className='container'>
        <aside className="barra-lateral">
      <div style={{display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: 'fit-content', alignItems: 'center'}}>
      <div className="cabecalho-perfil">
        <img
          src={mulher}
          alt="Foto do perfil"
          className="imagem-perfil"
          />
        <h2 className="nome-perfil">Nome do perfil</h2>
      </div>
      <div className="experiencia-perfil">
        <h3>Experiência</h3>
        <div className="cartao-experiencia">
          <strong>Cargo</strong> <span className="ano">Ano</span>
          <p>Breve descrição.</p>
        </div>
        <div className="cartao-experiencia">
          <strong>Cargo</strong> <span className="ano">Ano</span>
          <p>Breve descrição.</p>
        </div>
        <button className="botao-baixar">Baixar currículo</button>
      </div>
      </div>
      <div className="caixa-comandos">
        <div className="cartao-informacao">
          <div className="cabecalho-informacao">
            <h2>Funções</h2>
          </div>
        </div>
        <div className="funcionalidades">
         <div className="topicos">
            <img src={icon_um} alt="" />
            <p>Agende sua cosulta</p>
         </div>
         <div className="topicos">
            <img src={icon_dois} alt="" />
            <p>Vídeo Chamada</p>
         </div>
         <div className="topicos">
            <img src={icon_tres} alt="" />
            <p>Chat</p>
         </div>
         <div className="topicos">
            <img src={icon_quatro} alt="" />
            <p>Pagamento</p>
         </div>
        </div>
      </div>
    </aside>     
    </div>
  )
}

export default EditarProfissional
