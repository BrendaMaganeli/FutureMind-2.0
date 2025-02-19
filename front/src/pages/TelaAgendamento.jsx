import React from 'react'
import './CSS/TelaAgendamento.css'
import logoHorizontal from '../assets/logoHorizontal.svg'
const TelaAgendamento = () => {

  return (
    <div className='container-tela-agendamento_geral'>
      <div className='container-tela-agendamento_esquerda'>
        <div className='container-perfil'>
          <div className='container_foto_informações'>
          <img className='foto_perfil' src="user-profile-circle.svg" alt="" />
          <div className='container-perfil_informações'>
            <div className='div_nome_profissional'>
             <h1 className='nome_profissional'>Dr. juan pereira</h1>
            </div>
            <div className='div-CRC'>
              <p className='CRC'>CRC:111111/09</p>
            </div>
            <div className='div_button_chat'>
              <button className='button_chat'>Abrir chat</button>
            </div>
          </div>
          </div>
            <img className='logo' src={logoHorizontal} alt="" />
        </div>
        <div className='container_Formacao'>
          <div className='div_formacao'>
           <p className='p_formacao'>Formação:</p>
           <div className='container_bolinha_formacoes'>
            <img src="bolinha.svg" alt="" />
            <p>Pscologia</p>
           </div>
           <div className='container_bolinha_formacoes'>
            <img src="bolinha.svg" alt="" />
            <p>Mestrado em pscologia</p>
           </div>
           <div className='div_button_curriculo'>
            <button className='button_curriculo'>+ Abrir curriculo</button>
           </div>
          </div>
        </div>
        <div className='container_instrucoes'>
          <div className='subtitulo_instrucoes'>
            <p>Instruções da sessão:</p>
          </div>
          <div className='div_intrucoes_p'>
            <p className='p_intrucoes'>1-liberado a senha para a sessão 24h antes</p>
          </div>
          <div className='div_intrucoes_p'>
            <p className='p_intrucoes'>2-Confirmação de sessão somente após o pagamento</p>
          </div>
          <div className='div_intrucoes_p'>
            <p className='p_intrucoes'>3-Acesso a camera necessário se for combinado com seu psicologo.</p>
          </div>
        </div>
        <div className='container_abordagens'>
          <div className='subtitulo_abordagens'>
            <p>Abordagens</p>
          </div>
          <div className='container_abordagens_dois'>
            <div className='div_p_img_abordagens'>
              <div className='div_img_bolinha'>
               <img src="bolinha.svg" alt="" />
              </div>
              <p>Idosos</p>
            </div>
            <div className='div_p_img_abordagens'>
              <div className='div_img_bolinha'>
               <img src="bolinha.svg" alt="" />
              </div>
              <p>Crianças</p>
            </div>
            <div className='div_p_img_abordagens'>
              <div className='div_img_bolinha'>
               <img src="bolinha.svg" alt="" />
              </div>
              <p>Casais</p>
            </div>
          </div>
        </div>
      </div>

      <div className='container_tela_agendamento_direita'>
        <p>lado esquerdooo</p>
      </div>
    </div>
  )
}

export default TelaAgendamento
