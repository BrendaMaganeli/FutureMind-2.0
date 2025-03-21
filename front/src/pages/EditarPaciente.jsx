import mulher from '../assets/image 8.png';
import icon_um from '../assets/agenda 2.svg';
import icon_dois from '../assets/cam-recorder (1) 11.svg';
import icon_tres from '../assets/icons8-bate-papo-48 2.svg';
import logo from '../assets/Logo_SA_2FASE.png';
import voltar from '../assets/voltar 2.svg';
import './CSS/EditarPaciente.css';
import Arvore from '../assets/Group 239274.svg';
import { useState } from 'react';

function EditarPaciente() {

  const [isVisible, setIsVisible] = useState(false);
  
  // Função para alternar a visibilidade da div
  const toggleDiv = () => {
    setIsVisible(true);
    
  };

  const desativar_div =() => {

    setIsVisible(false)
  }


  

  return (
    <div>
    <div className={`container ${isVisible ? 'blur' : ''}`}>
        <aside className="barra-lateral-p">
      <div style={{display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: 'fit-content', alignItems: 'center'}}>
      <div className="cabecalho-perfil">
        <img
          src={mulher}
          alt="Foto do perfil"
          className="imagem-perfil"
          onClick={toggleDiv}
          />
        <h2 className="nome-perfil">José Carlos Azevedo</h2>
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
        </div>
      </div>
    </aside> 
   <div className="editar-paciente-maior">
        
   <div className="arvore-profissional">
        <img src={Arvore} alt="" />
    </div>

    <div className="botoes-maior-p">
      <div className="botoes-p">
        <img src={voltar} alt="" />
      </div>
    </div>
    <div className="loguinho-p">
      <img src={logo} alt="" />
    </div>

    <div className="editar-paciente">
        <div className="input-box">
          <label htmlFor="">
          Nome completo
        </label>
        <input type="text" />
        </div>
        <div className="input-box">
          <label htmlFor="">
          Cpf
        </label>
        <input type="text" />
        </div>
        <div className="input-box">
          <label htmlFor="">
          Telefone
        </label>
        <input type="text" />
        </div>
        <div className="input-box">
          <label htmlFor="">
          E-mail
        </label>
        <input type="email" />
        </div>
        <div className="input-box">
          <label htmlFor="">
          Data de nascimento
        </label>
        <input type="date" />
        </div>
        <div className="input-box">
          <label htmlFor="">
          Senha
        </label>
        <input type="password" />
        </div>
    </div>
    <div className="BTN-SALVAR">

        <button className="salvar-btn">Salvar</button>
    </div>
   </div>
   
    </div>
    {isVisible && (
      <div className='container_oculto_editar'>
        <div className='nav_div_oculta'>
           <p className='text_editar_foto_perfil'>Editar foto de perfil</p>
           <div className='conatiner_button_fechar_div_oculta'>
           </div>
        </div>
        <div className='container_oculta_corpo_geral'>
           <div className='container_oculta_corpo_esquerda'>
             <div className='quadrado_fotos'>
              <img className='fotos_editar' src="icone_usuario.svg" alt="" />
              <div className='conatiner_button_selecionar_foto'>
                <button className='button_selecionar_foto'> + Selecionar Foto</button>
              </div>
             </div>
           </div>
           <div className='container_oculta_corpo_direita'>
            <div className='container_info_previa'>
             <div className='conatiner_previa'>
               <p className='titulo_previa'>Prévia</p>
               <p className='descricao_previa'>Esta foto não interfere em seus documentos oficiais</p>
             </div>
             <div className='conatiner_modelo_redondo'>
                <div className='modelo_foto_redondo'>
                </div>
             </div>
             </div>
           </div>
        </div>
        <div className='container_footer_oculto'>
          <div className='footer_modelo_oculto'>
            <div className='container_button_remover_foto'>
              <button className='button_remover_foto'>Remover foto</button>
            </div>
            <div className='conatiner_buttons_cancelar_gostei'>
             <div className='container_button_cancelar_editar'>
               <button className='button_cancelar_editar' onClick={desativar_div}>Cancelar</button>
             </div>
             <div className='container_button_gostei_salvar'>
              <button className='button_gostei_salvar'>Gostei, Salvar</button>
             </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default EditarPaciente
