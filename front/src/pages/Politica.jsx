import { Link } from "react-router-dom";
import "./CSS/Politica.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import identificacao from "../assets/identificacao.svg";
import seguranca from "../assets/seguranca.svg";
import iconeChaves from "../assets/icone_chaves.svg";
import iconeBanco from "../assets/icone_banco.svg";
import voltar from '../assets/seta-principal.svg';


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [pathname]);

  return null;
}

function Politica() {
  return (
    <div className="body-politica">
      <button className="back-button-pt" >
      <img src={voltar} alt="" style={{width: '4em'}} />
      </button>
      <ScrollToTop />
      <div className="divBotoes">
        <Link to="/politica" className="botaodecisaoo">
          Política de Privacidade
        </Link>
        <Link to="/termo" className="botaodecisaodoiss">
          Termos de uso
        </Link>
      </div>
      <div className="container_bola_um"></div>
      <div className="container_bola_dois"></div>
      <div className="container_bola_tres"></div>
      <div className="container_bola_quatro"></div>
      <div className="conatiner_bola_cinco"></div>
      <div className="introducao">
        <div className="T_titulo">
          <h1>Política de Privacidade da FutureMind</h1>
        </div>
        <div className="textinho">
          <div className="text_prioridade">
            <p>Na FutureMind, a sua privacidade é nossa prioridade.</p>
          </div>
          <div className="text_comprometendo">
            <p>
              Comprometemo-nos a proteger suas informações pessoais e a garantir
              que você tenha uma experiência segura e confiável em nossa
              plataforma de terapia online.
            </p>
          </div>
          <div>
            <p>
              Esta Política de Privacidade descreve como coletamos, utilizamos,
              armazenamos e protegemos suas informações, além de esclarecer seus
              direitos em relação a esses dados. Ao utilizar nossos serviços,
              você concorda com as práticas aqui descritas, e estamos aqui para
              garantir que sua jornada rumo ao bem-estar mental seja
              transparente e respeitosa.
            </p>
          </div>
        </div>
      </div>
      <div className="container_acodions">
        <div className="accordion-container">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Direitos de Privacidade
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>
                Você tem o direito de acessar, corrigir ou solicitar a exclusão
                de seus dados pessoais a qualquer momento. Se desejar exercer
                esses direitos, entre em contato conosco.
              </p>
              <p>Formas de Contato:</p>
              <ul>
                <li>E-mail: contato@futuremind.com</li>
                <li>Telefone: (xx)xxxx-xxxx</li>
              </ul>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="accordion-container">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Dados Coletados Pela FutureMind
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>Os dados pessoais que coletamos são utilizados para:</p>
              <ul>
                <li>Fornecer e gerenciar nossos serviços de terapia.</li>
                <li>
                  Personalizar sua experiência e enviar informações relevantes.
                </li>
                <li>
                  Entrar em contato com você para agendamentos, confirmações e
                  follow-ups.
                </li>
                <li>Melhorar nossos serviços e conteúdo.</li>
              </ul>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="accordion-container">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Proteção dos Dados Pessoais
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>
                Implementamos medidas de segurança para proteger suas
                informações pessoais contra acesso não autorizado, alteração ou
                divulgação. Somente pessoas autorizadas têm acesso a esses
                dados, e utilizamos tecnologia de criptografia para garantir sua
                segurança.
              </p>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <div className="div-h1">
        <h1 className="H1_recursos">Quais Recursos Protegem seus Dados?</h1>
      </div>

      <div className="Container-recursos">
        <div className="div_um_recursos">
          <img src={identificacao} />
          <h2>
            Identificação <br /> de Usuário
          </h2>
        </div>

        <div className="div_dois_recursos">
          <img src={seguranca} />
          <h2>
            Segurança <br /> de dados
          </h2>
        </div>

        <div className="div_tres_recursos">
          <img src={iconeBanco} />
          <h2>
            Banco <br /> de dados
          </h2>
        </div>

        <div className="div_quatro_recursos">
          <img src={iconeChaves} />
          <h2>
            Chaves/ <br /> Senhas
          </h2>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Politica;
