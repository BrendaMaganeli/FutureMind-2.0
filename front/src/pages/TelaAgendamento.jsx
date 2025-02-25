import React from 'react'
import './CSS/TelaAgendamento.css'
import { Swiper, SwiperSlide } from 'swiper/react';


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
                 <p className='nome_usuario'>Dr. Juan Pereira</p>
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
            <div className='container-esquerdo_retangulo_dois'>
              <p className='titulo_formacao'>Formação</p>
              <div className='div_bolinha_formacao_esquerda'>
                <img className='imagem_bolinha' src="bolinha_azul_forte.svg" alt="" />
                <p className='formacoes'>Psicologia</p>
              </div>
              <div className='div_bolinha_formacao_esquerda'>
                <img className='imagem_bolinha' src="bolinha_azul_forte.svg" alt="" />
                <p className='formacoes'>Mestrado em psicologia</p>
              </div>
              <div className='div_button_abrir_curriculo'>
                <button className='button_abrir_curriculo'>+ Abrir curriculo</button>
              </div>
              
            </div>
            <div className='container-direito_retangulo_dois'>
              <p className='titulo_abordagem'>Abordagens</p>
              <div className='container_bolinha_formacao_direita'>
               <div className='div_bolinha_formacao_direita'>
                <img className='imagem_bolinha_direita' src="bolinha.svg" alt="" />
                <p className='abordagens'>Idosos</p>
               </div>
              </div>
              <div className='container_bolinha_formacao_direita'>
               <div className='div_bolinha_formacao_direita'>
                <img className='imagem_bolinha_direita' src="bolinha.svg" alt="" />
                <p className='abordagens'>Crianças</p>
               </div>
              </div>
              <div className='container_bolinha_formacao_direita'>
               <div className='div_bolinha_formacao_direita'>
                <img className='imagem_bolinha_direita' src="bolinha.svg" alt="" />
                <p className='abordagens'>Casais</p>
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container_tela_agendamento_direita'>
        <div className='div_agendar'>
         <h1 className='titulo_agendar'>Agendar consulta</h1>
        </div>
        <div>
          <button className='voltar_semana'>voltar</button>
          <Swiper>
           
          </Swiper>
          <button className='proximo_semana'>proximo</button>
        </div>
      </div>
    </div>
  )
}

export default TelaAgendamento;