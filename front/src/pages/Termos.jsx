import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Footer from "../Components/Footer";
import voltar from "../assets/seta-principal.svg";

import "./CSS/Termos.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Termos() {
  return (
    <div className="body-termos">
      <button className="back-button-pt">
        <img src={voltar} alt="Voltar" style={{ width: "4em" }} />
      </button>

      <ScrollToTop />

      <div className="divBotoes">
        <Link to="/politica" className="botaodecisao">
          Política de Privacidade
        </Link>
        <Link to="/termo" className="botaodecisaodois">
          Termos de Uso
        </Link>
      </div>

      <div className="container_bola_um"></div>
      <div className="container_bola_dois"></div>
      <div className="container_bola_tres"></div>
      <div className="container_bola_quatro"></div>
      <div className="conatiner_bola_cinco"></div>

      <div className="introducao">
        <div className="T_titulo">
          <h1>Termos de Uso da FutureMind</h1>
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
        {/* Aceitação dos Termos */}
        <div className="accordion-container">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Aceitação dos Termos
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>
                Ao acessar e utilizar o site FutureMind, você concorda em
                cumprir e estar vinculado aos seguintes Termos de Uso...
              </p>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* Direitos Autorais */}
        <div className="accordion-container">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Direitos Autorais
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>© 2024 FutureMind. Todos os direitos reservados...</p>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* Uso Permitido */}
        <div className="accordion-container">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Uso Permitido
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>
                Ao utilizar o site FutureMind, você concorda em fazer uso
                responsável e ético de nossos serviços e conteúdos...
              </p>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* Contato */}
        <div className="accordion-container-final">
          <Accordion className="container_ac">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <AccordionDetails className="titulo_ac_um">
                Contato
              </AccordionDetails>
            </AccordionSummary>
            <AccordionDetails className="textinhoAceitação">
              <p>
                Estamos aqui para ajudar você! Se você tiver dúvidas, sugestões
                ou precisar de mais informações...
              </p>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Termos;
