import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer.jsx";
import "./CSS/Landing_page.css";

const estiloCaixa = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1060,
  height: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
};

function Landing_page() {
  const [mostrarLogo, setMostrarLogo] = useState(true);
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const abrir = () => setAberto(true);
  const fechar = () => setAberto(false);
  const irParaPaciente = () => navigate("/cadastroPaciente");
  const irParaProfissional = () => navigate("/cadastroProfissional1");

  return (
    <div>
      {mostrarLogo ? (
        <div className="logo-container">
          <img src="logo oficial.svg" alt="Logo" className="logo-animada" />
        </div>
      ) : (
        <>
          <Navbar />

          <Modal open={aberto} onClose={fechar}>
            <Box sx={estiloCaixa}>
              <div className="container_modal">
                <div className="container_text_voltar">
                  <button onClick={fechar} className="button_voltar">
                    Sair
                  </button>
                </div>
                <div className="container_modal_opcoes">
                  <div className="esquerda_modal">
                    <div onClick={irParaProfissional} className="container_img">
                      <img src="imagem_profissional.svg" alt="" />
                      <div className="container_text_escolha">
                        <h2 className="text_escolha">Sou profissional</h2>
                      </div>
                    </div>
                  </div>
                  <div className="direita_modal">
                    <div onClick={irParaPaciente} className="container_img">
                      <img src="imagem_paciente.svg" alt="" />
                      <div className="container_text_escolha">
                        <h2 className="text_escolha">Sou paciente</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>

          <div className="container-geral_landing_um" data-aos="fade-up">
            <div className="container-geral_landing_esquerda_um">
              <div className="container_info_inicio_landing">
                <div className="container_h1_equilibrio">
                  <h1>Equilíbrio e bem estar ao seu alcance</h1>
                </div>
                <div className="container_p_moldamos">
                  <p className="p_moldamos">
                    Moldamos nosso próprio futuro, quando transformamos nossa
                    mente. Vamos cultivar esse futuro promissor juntos!
                  </p>
                </div>
                <div className="container_button_comece_ja">
                  <button className="button_comece_ja" onClick={abrir}>
                    Comece já
                  </button>
                </div>
              </div>
            </div>
            <div className="container-geral_landing_direita_um">
              <div className="container-test-um">
                <div className="cilindro_um_equilibrio"></div>
                <div className="cilindro_dois_equilibrio"></div>
                <div className="cilindro_tres_equilibrio"></div>
                <div className="cilindro_quatro_equilibrio"></div>
                <img
                  className="imagem_computador"
                  src="tela_computador.svg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div
            className="container-geral_landing_dois"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="container_info_emocional_esquerda">
              <div className="container_cilindros_emocional">
                <div className="cilindro_um_emocional"></div>
                <div className="cilindro_dois_emocional"></div>
                <div className="cilindro_tres_emocional"></div>
                <div className="cilindro_quatro_emocional"></div>
                <img
                  className="imagem_emocional"
                  src="Group 239264.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="container_info_emocional_direita">
              <div className="container_text_emocional">
                <h1 className="text_emocional">
                  Encontre uma vida emocional estável em suas mãos
                </h1>
              </div>
              <div className="container_p_text_emocional">
                <p className="p_text_emocional">
                  Cuidar das suas emoções é um passo essencial para uma vida
                  mais plena e feliz. Encontrar estabilidade emocional significa
                  cultivar o autoconhecimento, desenvolver resiliência e
                  fortalecer seus relacionamentos. Com as ferramentas certas,
                  você pode transformar desafios em oportunidades de crescimento
                  e bem-estar. Ao reconhecer suas emoções e aprender a lidar com
                  elas, você constrói uma base sólida para enfrentar o dia a dia
                  com mais tranquilidade e confiança. Pequenas mudanças na sua
                  rotina podem trazer grandes impactos na sua qualidade de vida.
                </p>
              </div>
            </div>
          </div>

          <div
            className="container-geral_funcionamento"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="container-geral_funcionamento_esquerda">
              <div className="conatainer_text_h1_funcionamento">
                <h1 className="text_h1_funcionamento">
                  Como funciona a terapia online?
                </h1>
              </div>
              <div className="container_text_p_funcionamento">
                <p className="text_p_funcionamento">
                  A FutureMind oferece terapia online prática e segura. Após um
                  cadastro rápido, o paciente escolhe o psicólogo ideal e agenda
                  sessões diretamente pelo app. As consultas são por vídeo, com
                  alta qualidade, e há um chat seguro para mensagens sigilosas.
                  Com pagamento integrado e interface intuitiva, a plataforma
                  assegura acessibilidade e suporte psicológico de qualidade.
                </p>
              </div>
            </div>
            <div className="container-geral_funcionamento_direita">
              <img
                className="imagem_funcional"
                src="imagem_emocional.svg"
                alt=""
              />
            </div>
          </div>

          <div
            className="container_text_bem-estar"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h1 className="h1_empresas">Empresas</h1>
            <h1 className="h1_bem-estar">
              que já cuidam do seu bem-estar dos colaboradores
            </h1>
          </div>

          <div
            className="container_bem-estar"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            {[
              "apoio-acate 1.svg",
              "senai_color 1.svg",
              "Softplan 1.svg",
              "imagem_gogle.svg",
              "imagem_bradesco.svg",
            ].map((src, idx) => (
              <div className="container_imagems_empresas" key={idx}>
                <img className="imagems_empresas_parceiras" src={src} alt="" />
              </div>
            ))}
          </div>

          <div
            className="container-geral_empresas_parceiras"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="container-geral_empresas_parceiras_esquerda">
              <div className="container_esquerdo_info_empresas">
                <div className="container_text_empresas_parceiras">
                  <h1 className="text_h1_empresas_parceiras">
                    Para empresas parceiras
                  </h1>
                </div>
                <div className="container_text_p_empresas_parceiras">
                  <p className="text_p_empresas_parceiras">
                    Empresas que investem na saúde mental de seus colaboradores
                    colhem benefícios como maior engajamento, produtividade e
                    retenção de talentos. Com um sistema de terapia acessível e
                    flexível, as equipes encontram o suporte necessário para
                    equilibrar vida pessoal e profissional, promovendo um
                    ambiente de trabalho mais saudável e motivador. Junte-se às
                    empresas que já priorizam o bem-estar e transforme a
                    experiência dos seus colaboradores!
                  </p>
                </div>
                <div className="container_button_empresas_parceiras">
                  <button className="button_empresas_parceiras" onClick={abrir}>
                    Começar agora!
                  </button>
                </div>
              </div>
            </div>
            <div className="container-geral_empresas_parceiras_direita">
              <div className="container_info_cilindros_empresas">
                <div className="cilindro_empresa_um"></div>
                <div className="cilindro_empresa_dois"></div>
                <div className="cilindro_empresa_tres"></div>
                <div className="cilindro_empresa_quatro"></div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}

export default Landing_page;
