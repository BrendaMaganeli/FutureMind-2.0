import React from 'react'
import './CSS/TelaAgendamento.css'

const TelaAgendamento = () => {

  return (
    <div className='container-tela-agendamento_geral'>
      <div className='container-tela-agendamento_esquerda'>
        <div className='container'>
          <div className='container_retangulo_um'>
            <div className='container_informações_um'>
             <div className='informações'>
               <div className='div_image '>
                <img src="user-profile-circle.svg" alt="" />
               </div>
               <div className='container_nome_crc_button'>
                 <p className='nome_usuario'>Nome profissional</p>
               <div>
                <p>CRC:111111/99</p>
               </div>
               <div className='div_button_chat'>
                <button className='button_abrir_chat'>Abrir chat</button>
               </div>
               </div>
             </div>
             <div className='logo_agendamento'>
               <img className='imagem_logo' src="Logo_sa_arvore.svg" alt="" />
             </div>
            </div>
            <div className='instrucoes_sessao'>
             <p className='titulo_instrucoes'>Instruções da sessão</p>
             <p className='instrucoes'>1-Liberado a senha para a sessão 24h antes.</p>
             <p className='instrucoes'>2-Acesso a camera necessário se for combinado com seu psicologo.</p>
             <p className='instrucoes'>3-Confirmação de sessão somente após o pagamento.</p>
            </div>
          </div>
          <div className='container_retangulo_dois'>
            d
          </div>
        </div>
      </div>

      <div className='container_tela_agendamento_direita'>
        <p>lado esquerdooo</p>
      </div>
    </div>
  )
}

export default TelaAgendamento;