// Importações de bibliotecas e componentes necessários
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './CSS/Termos.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


// Componente para rolar a página até o topo sempre que a rota mudar
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Faz a rolagem para o topo
  }, [pathname]);

  return null;
}

// Componente principal dos Termos de Uso
function Termos() {
  return (
    <div className='body-termos'>
      {/* Barra de navegação */}
      <ScrollToTop />
      {/* Botões para navegação entre Política de Privacidade e Termos de Uso */}
      <div className='divBotoes'>
        <Link to='/politica' className='botaodecisao'>Política de Privacidade</Link>
        <Link to='/termo' className='botaodecisaodois'>Termos de Uso</Link>
      </div>
      <div className='container_bola_um'></div>
      <div className='container_bola_dois'></div>
      <div className='container_bola_tres'></div>
      <div className='container_bola_quatro'></div>
      <div className='conatiner_bola_cinco'></div>
      <div className='introducao'>
        <div className='T_titulo'>
          <h1>Termos de Uso da FutureMind</h1>
        </div>
        <div className='textinho'>
          <div className='text_prioridade'>
            <p>Na FutureMind, a sua privacidade é nossa prioridade.</p>
          </div>
          <div className='text_comprometendo'>
            <p>Comprometemo-nos a proteger suas informações pessoais e a garantir que você tenha uma experiência segura e confiável em nossa plataforma de terapia online.</p>
          </div>
          <div>
            <p>Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações, além de esclarecer seus direitos em relação a esses dados.
            Ao utilizar nossos serviços, você concorda com as práticas aqui descritas, e estamos aqui para garantir que sua jornada rumo ao bem-estar mental seja transparente e respeitosa.</p>
          </div>
        </div>
      </div>
      {/* Elementos visuais decorativos */}
      {/* Seção de Acordeões com informações detalhadas */}
      <div className='container_acodions'>
      <div className='accordion-container'>
        {/* Primeiro Acordeão: Aceitação dos Termos */}
        <Accordion className='container_ac'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            <AccordionDetails className='titulo_ac_um'>
              Aceitação dos Termos
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Ao acessar e utilizar o site FutureMind, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concordar com estes termos, pedimos que não utilize nosso site.
               Os Termos de Uso são aplicáveis a todos os usuários, visitantes e qualquer pessoa que acesse o conteúdo e serviços oferecidos pelo FutureMind. Reservamo-nos o direito de modificar estes termos a qualquer momento, e recomendamos que você os revise periodicamente. Seu uso contínuo do site após a publicação de alterações constitui aceitação das novas condições.
               No FutureMind, nossa missão é proporcionar um espaço seguro e acolhedor para a terapia e o bem-estar emocional. Ao utilizar nossos serviços, você concorda em respeitar as diretrizes e políticas estabelecidas, buscando sempre um ambiente positivo e construtivo.</p>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='accordion-container'>
        {/* Segundo Acordeão: Direitos Autorais */}
        <Accordion className='container_ac'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
            <AccordionDetails className='titulo_ac_um'>
              Direitos Autorais
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>© 2024 FutureMind. Todos os direitos reservados.
            O conteúdo deste site, incluindo textos, imagens, gráficos, logotipos e materiais relacionados,
            é protegido por leis de direitos autorais e propriedade intelectual. Nenhuma parte deste site 
            pode ser reproduzida, distribuída, modificada ou utilizada de qualquer forma sem a autorização
            prévia por escrito da FutureMind.</p>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='accordion-container'>
        {/* Terceiro Acordeão: Uso Permitido */}
        <Accordion className='container_ac'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
            <AccordionDetails className='titulo_ac_um'>
              Uso Permitido
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Ao utilizar o site FutureMind, você concorda em fazer uso responsável e ético de nossos serviços e conteúdos. O uso permitido inclui:
              Acesso aos Conteúdos: Você pode acessar, visualizar e interagir com os materiais disponibilizados no site, como artigos, vídeos e recursos 
              relacionados à terapia e ao bem-estar.
              Compartilhamento de Experiências: Você é encorajado a compartilhar suas experiências e feedback, 
              desde que faça isso de maneira respeitosa e construtiva, contribuindo para um ambiente acolhedor.
              Criação de Conta: Caso decida criar uma conta, você deve fornecer informações precisas e atualizadas,
               mantendo a confidencialidade de sua senha e sendo responsável por todas as atividades realizadas em sua conta.
              Proibições: É estritamente proibido:
              Utilizar o site para fins ilegais ou não autorizados.
              Compartilhar informações falsas, enganosas ou prejudiciais.
              Realizar atividades que possam comprometer a segurança do site ou a experiência de outros usuários, como assédio, discriminação ou spam.
              Ao seguir estas diretrizes, você ajuda a manter um ambiente seguro e positivo para todos os usuários do FutureMind.
               Agradecemos sua colaboração e desejamos uma experiência enriquecedora em sua jornada de autoconhecimento e crescimento pessoal!</p>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='accordion-container-final'>
        {/* Quarto Acordeão: Contato */}
        <Accordion className='container_ac'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
            <AccordionDetails className='titulo_ac_um'>
              Contato
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Estamos aqui para ajudar você! Se você tiver dúvidas, sugestões ou precisar de mais informações sobre nossos serviços, não hesite em entrar em contato conosco. A sua experiência é importante para nós, e queremos garantir que você tenha todo o apoio necessário em sua jornada de autoconhecimento e bem-estar.
              <br />
               Formas de Contato:
               <br />
               E-mail:[futuremind.tecn@gmail.com]
               <br />
               Telefone:[(48)98982-1222]
               <br />
               Agradecemos por escolher a FutureMind. Estamos ansiosos para ouvir de você e apoiá-lo em sua jornada de terapia!</p>
          </AccordionDetails>
        </Accordion>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Termos;