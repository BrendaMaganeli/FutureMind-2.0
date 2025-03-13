import React from 'react'
import Navbar from '../Components/Navbar'
import './CSS/Landing_page.css'

function Landing_page() {
  return (
    <div>
      <Navbar/>
      <div className='container-geral_landing_um'>
          <div className='container-geral_landing_esquerda_um'>
            <div className='container_info_inicio_landing'>
            <div className='container_h1_equilibrio'>
              <h1>Equilíbrio e bem estar ao seu alcance</h1>
            </div>
            <div className='container_p_moldamos'>
              <p className='p_moldamos'>Moldamos nosso próprio futuro, quando transformamos 
              nossa mente. Vamos cultivar esse futuro promissor juntos!</p>
            </div>
             <div className='container_button_comece_ja'>
               <button className='button_comece_ja'>Comece já</button>
             </div>  
             </div>
          </div>
          <div className='container-geral_landing_direita_um'>
            <div className='container-test-um '> 
              <div className='cilindro_um_equilibrio'></div>
              <div className='cilindro_dois_equilibrio'></div>
              <div className='cilindro_tres_equilibrio'></div>
              <div className='cilindro_quatro_equilibrio'></div>
              <img className='imagem_computador' src="tela_computador.svg" alt="" />
            </div>
          </div>
      </div>
      <div className='container-geral_landing_dois'>
        <div className='container_info_emocional_esquerda'>
          <div className='container_cilindros_emocional'>
            <div className='cilindro_um_emocional'></div>
            <div className='cilindro_dois_emocional'></div>
            <div className='cilindro_tres_emocional'></div>
            <div className='cilindro_quatro_emocional'></div>
            <img className='imagem_emocional' src="imagem_emocional.svg" alt="" />
          </div>
        </div>
        <div className='container_info_emocional_direita'> 
          <div className='container_text_emocional'>
            <h1 className='text_emocional'>Encontre uma vida emocional estável em suas mãos </h1>
          </div>
          <div className='container_p_text_emocional'>
            <p className='p_text_emocional'>Cuidar das suas emoções é um passo essencial para uma vida mais plena e feliz. Encontrar estabilidade emocional significa cultivar o autoconhecimento, desenvolver resiliência e fortalecer seus relacionamentos. Com as ferramentas certas, você pode transformar desafios em oportunidades de crescimento e bem-estar.
            Ao reconhecer suas emoções e aprender a lidar com elas, você constrói uma base sólida para enfrentar o dia a dia com mais tranquilidade e confiança. Pequenas mudanças na sua rotina podem trazer grandes impactos na sua qualidade de vida. </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing_page
