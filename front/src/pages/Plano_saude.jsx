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
         <h1 className='entenda'>Entenda quem somos e porque existimos</h1>
       </div>
       <div className='container-contato'>
         <div className='container-contado_esquerdo'>
          <div className='container_info_contato'>
            <div className='div_h1_contato'>
             <h1 className='h1_contato'>Entre em contato com a gente!</h1>
            </div>
           <div className='container_location_p'>
             <img src="map_location.svg" alt="" />
             <p className='loalizacao_email'>R. Amauri Souza, 346</p>
           </div>
           <div className='container_email_p'>
             <img src="email_icon.svg" alt="" />
             <p className='loalizacao_email'>contato@futuremind.com.br</p>
           </div>
           <div className='div_button_sobre'>
             <button className='button_sobre'>Sobre nós</button>
           </div>
          </div>
         </div>
         <div className='container-contado_direito'>
         <div className='container_conecte_plano'>
           <div className='container_text_conect'>
             <h1 className='text_conect'>Conecte seu plano de saúde</h1>
           </div>
           <div className='container_text_input_cadastro'>
             <p className='p_padrao_plano'>Adicione o numero de cadastro</p>
             <input placeholder='Ex: 56388763' className='input_padrao_plano' type="text" />
           </div>
           <div className='container_text_input_senha'>
             <p className='p_padrao_plano'>Adicione sua senha</p>
             <input placeholder='Ex: Bo98cu53' className='input_padrao_plano' type="text" />
           </div>
           <div className='container_button_plano'>
            <button className='button_entrar_plano'>Entrar</button>
           </div>
         </div>
         </div>
       </div>
        <Footer/>
    </div>
  )
}

export default Plano_saude
