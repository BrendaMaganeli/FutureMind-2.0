// Importações de bibliotecas e componentes necessários
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CSS/Termos.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import bolona from '../assets/bolona.png';
import bolona2 from '../assets/bolona2.png';
import bolonaEsquerda from '../assets/bolonaEsquerda.png';

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
      <Navbar />
      <ScrollToTop />

      {/* Botões para navegação entre Política de Privacidade e Termos de Uso */}
      <div className='divBotoes'>
        <Link to='/politica' className='botaodecisao'>Política de Privacidade</Link>
        <Link to='/termo' className='botaodecisaodois'>Termos de Uso</Link>
      </div>

      {/* Introdução com título e descrição */}
      <div className='introducao'>
        <div className='T_titulo'>
          <h1>Termos de Uso da FutureMind</h1>
        </div>
        <div className='textinho'>
          <div>
            <p>Na FutureMind, a sua privacidade é nossa prioridade.</p>
          </div>
          <div>
            <p>Comprometemo-nos a proteger suas informações pessoais e a garantir que você tenha uma experiência segura e confiável em nossa plataforma de terapia online.</p>
            <img src={bolona} className='boolinha' alt='Decoração'/>
          </div>
          <div>
            <p>Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações, além de esclarecer seus direitos em relação a esses dados.</p>
            <p>Ao utilizar nossos serviços, você concorda com as práticas aqui descritas, e estamos aqui para garantir que sua jornada rumo ao bem-estar mental seja transparente e respeitosa.</p>
            <img src={bolona} className='bolinha3' alt='Decoração'/>
          </div>
        </div>
      </div>

      {/* Elementos visuais decorativos */}
      <div className='bolona_termos'>
        <img src={bolona2} alt='Decoração'/>
      </div>
      <div className='bolaEsquerda'>
        <img src={bolona} className='bolinha2' alt='Decoração'/>
      </div>
      <div className='bolaEsquerda'>
        <img src={bolonaEsquerda} className='bolonaes' alt='Decoração'/>
      </div>

      {/* Seção de Acordeões com informações detalhadas */}
      <div className='accordion-container'>
        {/* Primeiro Acordeão: Aceitação dos Termos */}
        <Accordion className='container_ac'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            <AccordionDetails className='titulo_ac_um'>
              Aceitação dos Termos
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Ao acessar e utilizar o site FutureMind, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso...</p>
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
            <p>© 2024 FutureMind. Todos os direitos reservados...</p>
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
            <p>Ao utilizar o site FutureMind, você concorda em fazer uso responsável e ético...</p>
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
            <p>Estamos aqui para ajudar você! Se tiver dúvidas, sugestões ou precisar de mais informações...</p>
          </AccordionDetails>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
}

export default Termos;