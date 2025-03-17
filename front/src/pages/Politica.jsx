import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import './CSS/Politica.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import bolona from '../assets/bolona.png';
import bolona2 from '../assets/bolona2.png';
import bolonaEsquerda from '../assets/bolonaEsquerda.png';
import identificacao from '../assets/identificacao.svg';
import seguranca from '../assets/seguranca.svg';
import iconeChaves from '../assets/icone_chaves.svg';
import iconeBanco from '../assets/icone_banco.svg'

// Função para rolar para o topo ao mudar de rota
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Garante que a página começa no topo
  }, [pathname]);

  return null;
}

// Componente principal para a página de Política de Privacidade
function Politica() {
  return (
    <div className='body-politica'>
      {/* Navbar fixa no topo da página */}
      <Navbar />
      <ScrollToTop />

      {/* Botões para navegação entre Política de Privacidade e Termos de Uso */}
      <div className='divBotoes'>
        <Link to='/politica' className='botaodecisaoo'>Política de Privacidade</Link>
        <Link to='/termo' className='botaodecisaodoiss'>Termos de uso</Link>
      </div>

      {/* Introdução da Política de Privacidade */}
      <div className='introducao'>
        <div className='T_titulo'>
          <h1>Política de Privacidade da FutureMind</h1>
        </div>
        <div className='textinho'>
          <div>
            <p>Na FutureMind, a sua privacidade é nossa prioridade.</p>
          </div>

          <div>
            <p>Comprometemo-nos a proteger suas informações pessoais e a garantir que você tenha uma experiência segura e confiável em nossa plataforma de terapia online.</p>
            <img src={bolona} className='boolinha' />
          </div>

          <div>
            <p>Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações, além de esclarecer seus direitos em relação a esses dados. Ao utilizar nossos serviços, você concorda com as práticas aqui descritas, e estamos aqui para garantir que sua jornada rumo ao bem-estar mental seja transparente e respeitosa.</p>
            <img src={bolona} className='bolinha3' />
          </div>
        </div>
      </div>

      {/* Elementos visuais decorativos */}
      <div className='bolona_termos'>
        <img src={bolona2} />
      </div>

      <div className='bolaEsquerda'>
        <img src={bolona} className='bolinha2' />
      </div>

      <div className='bolaEsquerda'>
        <img src={bolonaEsquerda} className='bolonaes' />
      </div>

      {/* Seções expansíveis (Accordion) */}
      <div className='accordion-container'>
        <Accordion className='container_ac'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <AccordionDetails className='titulo_ac_um'>
              Direitos de Privacidade
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento. Se desejar exercer esses direitos, entre em contato conosco.</p>
            <p>Formas de Contato:</p>
            <ul>
              <li>E-mail: contato@futuremind.com</li>
              <li>Telefone: (xx)xxxx-xxxx</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='accordion-container'>
        <Accordion className='container_ac'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <AccordionDetails className='titulo_ac_um'>
              Dados Coletados Pela FutureMind
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Os dados pessoais que coletamos são utilizados para:</p>
            <ul>
              <li>Fornecer e gerenciar nossos serviços de terapia.</li>
              <li>Personalizar sua experiência e enviar informações relevantes.</li>
              <li>Entrar em contato com você para agendamentos, confirmações e follow-ups.</li>
              <li>Melhorar nossos serviços e conteúdo.</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='accordion-container'>
        <Accordion className='container_ac'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <AccordionDetails className='titulo_ac_um'>
              Proteção dos Dados Pessoais
            </AccordionDetails>
          </AccordionSummary>
          <AccordionDetails className='textinhoAceitação'>
            <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração ou divulgação. Somente pessoas autorizadas têm acesso a esses dados, e utilizamos tecnologia de criptografia para garantir sua segurança.</p>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Recursos que protegem os dados */}
      <div className='div-h1'>
        <h1 className='H1_recursos'>Quais Recursos Protegem seus Dados?</h1>
      </div>

      <div className='Container-recursos'>
        <div className='div_um_recursos'>
          <img src={identificacao} />
          <h2>Identificação <br /> de Usuário</h2>
        </div>

        <div className='div_dois_recursos'>
          <img src={seguranca} />
          <h2>Segurança <br /> de dados</h2>
        </div>

        <div className='div_tres_recursos'>
          <img src={iconeBanco} />
          <h2>Banco <br /> de dados</h2>
        </div>

        <div className='div_quatro_recursos'>
          <img src={iconeChaves} />
          <h2>Chaves/ <br /> Senhas</h2>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Politica;