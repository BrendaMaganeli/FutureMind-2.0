import React from 'react'
import './CSS/TelaAgendamento.css'

const TelaAgendamento = () => {

  return (
    <div className='container-tela-agendamento_geral'>
      <div className='container-tela-agendamento_esquerda'>
        <div className='container-perfil'>
          <div className='container_foto_informações'>
          <img className='foto_perfil' src="user-profile-circle.svg" alt="" />
          <div className='container-perfil_informações'>
            <div className='div_nome_profissional'>
             <h1 className='nome_profissional'>nome usuario</h1>
            </div>
            <div className='div-CRC'>
              <p className='CRC'>CRC:111111/09</p>
            </div>
            <div className='div_button_chat'>
              <button className='button_chat'>abrir chat</button>
            </div>
          </div>
          </div>
            <img className='logo' src="user-profile-circle.svg" alt="" />
        </div>
      </div>
      <div className='container_tela_agendamento_direita'>
        <p>lado esquerdooo</p>
      </div>
    </div>
  )
}

export default TelaAgendamento
