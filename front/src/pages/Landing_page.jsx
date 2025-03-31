import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import './CSS/Landing_page.css'
import Footer from '../Components/Footer.jsx'
import { Link } from 'react-router-dom';

function Landing_page() {

  
    const [isVisible, setIsVisible] = useState(false)
    
    // Função para alternar a visibilidade da div
    const toggleDiv = () => {
      setIsVisible(true);
      
    };
  
    const desativar_div =() => {
  
      setIsVisible(false)
    }

  return (
    <div>
    <div className={`'container-geral_landing_um' ${isVisible ? 'blur' : ''}`}>
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
               <button onClick={toggleDiv} className='button_comece_ja'>Comece já</button>
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
      <div className='container-geral_funcionamento'>
          <div className='container-geral_funcionamento_esquerda'>
             <div className='conatainer_text_h1_funcionamento'>
              <h1 className='text_h1_funcionamento'>Como funciona a terapia online? </h1>
             </div>
             <div className='container_text_p_funcionamento'>
              <p className='text_p_funcionamento'>A FutureMind facilita o acesso à terapia online de forma prática e segura. Após um cadastro rápido, o paciente escolhe um psicólogo conforme suas necessidades, considerando especialidade, experiência e abordagem. O agendamento é feito diretamente pelo app, com notificações para lembrar os compromissos.
                 As sessões ocorrem por chamada de vídeo de alta qualidade, proporcionando uma experiência próxima ao atendimento presencial. Além disso, o chat seguro permite a troca de mensagens sigilosas entre paciente e terapeuta.
                 Com um sistema de pagamentos integrado e uma interface intuitiva, a FutureMind garante transparência, acessibilidade e um suporte psicológico de qualidade.</p>
             </div>
          </div>
          <div className='container-geral_funcionamento_direita'>
             <img className='imagem_funcional' src="imagem_funcional.svg" alt="" />
          </div>
      </div>
       <div className='container_text_bem-estar'>
        <h1 className='h1_empresas'>Empresas</h1> <h1 className='h1_bem-estar'>que já cuidam do seu bem-estar dos colaboradores</h1>
       </div>
       <div className='container_bem-estar'>
          <div className='container_imagems_empresas'><img className='imagems_empresas_parceiras' src="apoio-acate 1.svg" alt="" /></div>
          <div className='container_imagems_empresas'><img className='imagems_empresas_parceiras' src="senai_color 1.svg" alt="" /></div>
          <div className='container_imagems_empresas'><img className='imagems_empresas_parceiras' src="Softplan 1.svg" alt="" /></div>
          <div className='container_imagems_empresas'><img className='imagems_empresas_parceiras' src="imagem_gogle.svg" alt="" /></div>
          <div className='container_imagems_empresas'><img className='imagems_empresas_parceiras' src="imagem_bradesco.svg" alt="" /></div>
       </div>
       <div className='container-geral_empresas_parceiras'>
          <div className='container-geral_empresas_parceiras_esquerda'>
            <div className='container_esquerdo_info_empresas'>
            <div className='container_text_empresas_parceiras'>
              <h1 className='text_h1_empresas_parceiras'>Para empresas parceiras</h1>
            </div>  
            <div className='container_text_p_empresas_parceiras'>
              <p className='text_p_empresas_parceiras'>
              Empresas que investem na saúde mental de seus colaboradores colhem benefícios como maior engajamento,
              produtividade e retenção de talentos. Com um sistema de terapia acessível e flexível, as equipes encontram
              o suporte necessário para equilibrar vida pessoal e profissional, promovendo um ambiente de trabalho mais
              saudável e motivador. Junte-se às empresas que já priorizam o bem-estar e transforme a experiência dos
              seus colaboradores!
              </p>
            </div>
            <div className='container_button_empresas_parceiras'>
              <button className="button_empresas_parceiras">Começar agora!</button>
            </div>
            </div>  
          </div>
          <div className='container-geral_empresas_parceiras_direita'>
             <div className='container_info_cilindros_empresas'>
                <div className='cilindro_empresa_um'></div>
                <div className='cilindro_empresa_dois'></div>
                <div className='cilindro_empresa_tres'></div>
                <div className='cilindro_empresa_quatro'></div>
             </div>
          </div>
       </div>
       <Footer/>
    </div>
    {isVisible && (
       <div className='container_escolher_conta'>
        <div className='container_button_x_escolher_conta'>
         <button className='button_x_escolher_conta' onClick={desativar_div}><img src="imagem_voltar_escolher.svg" alt="" /></button>
        </div>
        <div className='container_geral_escolher'>
          <div className='container_esquerda_escolher'>
          <Link className='link_geral' to="/cadastroprofissional1">
            <div className='container_foto_p_escolher'>
              <img className='imagem_profissional_escolher' src="imagem_profissional.svg" alt="" />
              <div  className='container_text_escolher_profissional'>
                <p className='text_escolher_profissional'>Sou Profissional</p>
              </div>  
            </div>
            </Link>
          </div>
          
           <div className='container_direita_escolher'>
           <Link className='link_geral' to="/cadastroPaciente">
            <div className='container_foto_p_escolher_paciente'>           
              <img className='imagem_paciente_escolher' src="imagem_paciente.svg" alt="" />
             <div className='container_text_escolher_paciente'>
              <p className='text_escolher_paciente'>Sou Paciente</p>
             </div>
             </div>
             </Link>
           </div>
          
         
        </div>
       
       </div>
    )}
    </div>
  )
}

export default Landing_page
