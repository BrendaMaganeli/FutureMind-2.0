import NavBar from '../Components/Navbar'
import './CSS/Plano_saude.css'
import Footer from '../Components/Footer.jsx'
import Foto from '../assets/Pic.svg'

function Plano_saude() {

  return (
    <div className='container-planoSaude'>
       <NavBar cor={"rgba(90,120,159, .5)"}/>   
       <div className='container-boas-vindas'>
        <div className='container-mensagemboas'>
          <div className='info'>
            <div className='info_boas'>
              <h5>BOAS-VINDAS A FUTUREMIND👋</h5>
            </div>
            <div className='info_texto_h1'>
              <h1>Assistência psicológica simplificada para todos</h1>
            </div>
            <div className='info_profissionais'>
              <p>Os psicologos da FutureMind  vão além dos sintomas para tratar a causa raiz do seu problema.</p>
            </div>
            <div className='info_div_button'>
              <button className='button_info'>AGENDE SUA CONSULTA</button>
            </div>
          </div>   
        </div>
       </div>
       <div className='container-media-geral'>
        <div className='media_pesquisa'>
          <h1 className='numeros'>+3.5000</h1>
          <p className='texto_numero'>Pacientes atendidos</p>
        </div>
        <div className='media_pesquisa'>
          <h1 className='numeros'>+15</h1>
          <p className='texto_numero'>Especialistas disponíveis</p>
        </div>
        <div className='media_pesquisa_10'>
          <h1 className='numeros'>+10</h1>
          <p className='texto_numero'>Anos no mercado</p>
        </div>
       </div>
       <div className='container-sobre-nos'>
         <div className='img-sobre'>
          <img src={Foto} alt="" />
         </div>
         <div className='texto-sobre'>
          <p>SOBRE NÓS</p>
          <div className='tit-entenda'>
            <h1>Entenda quem somos e por que existimos</h1>
          </div>
          <div className='texto-entenda'>
            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.</p>
          </div>
         </div>
       </div>
       <div className='container-entenda'>
         entenda
       </div>
       <div className='container-contato'>
         contato
       </div>
        <Footer/>
    </div>
  )
}

export default Plano_saude
