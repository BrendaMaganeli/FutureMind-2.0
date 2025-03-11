import React from 'react'
import Navbar from '../Components/Navbar'
import './CSS/Landing_page.css'

function Landing_page() {
  return (
    <div>
      <Navbar/>
      <div className="container-geral_landing">
          <div className="container-geral_landing_esquerda">
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
          <div className="container-geral_landing_direita">
             olaaaaaa
          </div>
      </div>
    </div>
  )
}

export default Landing_page
