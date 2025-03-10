
import mulher from '../assets/image 8.png';
import icon_um from '../assets/agenda 2.svg';
import icon_dois from '../assets/cam-recorder (1) 11.svg';
import icon_tres from '../assets/icons8-bate-papo-48 2.svg';
import logo from '../assets/Logo_SA_2FASE.png';
import voltar from '../assets/voltar 2.svg';
import './CSS/EditarProfissional.css';
import { useState } from 'react';
import EditarProComponente from '../Components/EditarProComponente';
import HistoricoConsulta from '../Components/HistoricoConsulta';

function EditarProfissional() {

  const [ corpoPerfil, setCorpoPerfil ] = useState(<EditarProComponente />)

  function mudarprahistorico(){
    console.log("Botão clicado!!!")
    setCorpoPerfil(<HistoricoConsulta />)
  }

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
        <div className="cartao-experiencia-p">
          <div style={{display: 'flex', gap: '240px'}}>
          <strong>Cargo</strong> <span className="ano">Ano</span>
          </div>
          <input maxLength='25' placeholder='Breve descrição' />
        </div>
        <div className="cartao-experiencia-p">
        <div style={{display: 'flex', gap: '240px'}}>
          <strong>Cargo</strong> <span className="ano">Ano</span>
        </div>
          <input maxLength='25' placeholder='Breve descrição' />
        </div>
        <button className="botao-baixar">Baixar currículo</button>
      </div>
      </div>
      <div className="caixa-comandos-p">
       
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
            <img src={icon_tres} alt="" />
            <button className='botaocomponente' onClick={mudarprahistorico}>Histórico de Consulta</button>
         </div>       
        </div>
      </div>
    </aside> 
   <div className="editar-profissional-maior">
        
   <div className="arvore-profissional">
        <img src="Arvore Perfil.png" alt="" />
    </div>

    <div className="botoes-maior">
      <div className="botoes">
        <img src={voltar} alt="" />
      </div>
    </div>
    <div className="loguinho">
      <img src={logo} alt="" />
    </div>
    <div className='corpoeditarpro'>
      {corpoPerfil}
    </div>
   </div>
    </div>
  )
}

export default EditarProfissional
