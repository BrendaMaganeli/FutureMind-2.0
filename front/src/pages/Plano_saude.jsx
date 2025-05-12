import { useEffect, useState } from "react";
import NavBar from "../Components/Navbar";
import "./CSS/Plano_saude.css";
import Footer from "../Components/Footer.jsx";
import Foto from "../assets/Pic.svg";

import mensal from "../assets/Mensal.svg";
import trimestral from "../assets/Trimestral.svg";
import empresarial from "../assets/empresarial.svg";
import { useNavigate } from "react-router-dom";
import { Modal, Box } from "@mui/material";
import ModalLogin from "../Components/ModalLogin.jsx";

function Plano_saude() {
  const [modalAberto, setModalAberto] = useState(false);
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [senhaEmpresa, setSenhaEmpresa] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [modalPrataAberto, setModalPrataAberto] = useState(false);
  const [modalOuroAberto, setModalOuroAberto] = useState(false);
  const navigate = useNavigate();
  const [carregandoPlano, setCarregandoPlano] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

  const profissional = JSON.parse(localStorage.getItem('User-Profile'));

  const abrirModalPrata = () => setModalPrataAberto(true);
  const fecharModalPrata = () => setModalPrataAberto(false);

  const abrirModalOuro = () => setModalOuroAberto(true);
  const fecharModalOuro = () => setModalOuroAberto(false);

  const abrirModal = () => {
    
    setModalAberto(true);
    setEmailEmpresa("");
    setSenhaEmpresa("");
  };

  const fecharModal = () => setModalAberto(false);

  const confirmarCadastro = () => {

    if (profissional) {

      setErroEmail("");
      setErroSenha("");
      
      let temErro = false;
      
      if (!emailEmpresa) {
        setErroEmail("Por favor, preencha o e-mail.");
        temErro = true;
      } else if (!emailEmpresa.endsWith("@sofplan.com")) {
        setErroEmail('O e-mail deve terminar com ex:"@empresa.com".');
        temErro = true;
      }
      
      if (!senhaEmpresa) {
        setErroSenha("Por favor, preencha a senha.");
        temErro = true;
      } else if (senhaEmpresa.length !== 8) {
        setErroSenha("A senha deve conter exatamente 8 dígitos.");
        temErro = true;
      }
      
      if (temErro) return;
      
      console.log("E-mail Empresarial:", emailEmpresa);
      console.log("Senha Empresarial:", senhaEmpresa);
      fecharModal();
    } else {

      setModalAberto(false);
      setMostrarModalLogin(true);
    }
  };

  const confirmarPlano = () => {

    if (profissional) {

      setCarregandoPlano(true);
      setTimeout(() => {
        setCarregandoPlano(false);
        fecharModalPrata();
        navigate("/pagamento");
      }, 1500);
    } else {

      setModalOuroAberto(false);
      setModalPrataAberto(false);
      setModalAberto(false);
      setMostrarModalLogin(true);
    }
  };

  useEffect(() => {
    if (emailEmpresa.length > 0) {
      setErroEmail(false);
    }
  }, [emailEmpresa]);

  useEffect(() => {
    if (senhaEmpresa.length > 0) {
      setErroSenha(false);
    }
  }, [senhaEmpresa]);

  const navega = () => {

    if (profissional) {

      navigate("/agendamento"); // rota que leva à tela de agendamento
    } else {

      setMostrarModalLogin(true);
    }
  };

  return (
    <div className="container-planoSaude">
      <NavBar cor={"rgba(90,120,159, .5)"} />

      <div className="container-boas-vindas">
        <div className="container-mensagemboas">
          <div className="info">
            <div className="info_boas">
              <h5>BOAS-VINDAS A FUTUREMIND</h5>
            </div>
            <div className="info_texto_h1">
              <h1>Assistência psicológica simplificada para todos</h1>
            </div>
            <div className="info_profissionais">
              <p>
                Os psicólogos da FutureMind vão além dos sintomas para tratar a
                causa raiz do seu problema.
              </p>
            </div>
            <div className="info_div_button">
              <button className="button_info" onClick={navega}>
                AGENDE SUA CONSULTA
              </button>
            </div>
            
          </div>
        </div>
      </div>

      <div className="container-media-geral">
        <div className="media_pesquisa">
          <h1 className="numeros">+3.500</h1>
          <p className="texto_numero">Pacientes atendidos</p>
        </div>
        <div className="media_pesquisa">
          <h1 className="numeros">+15</h1>
          <p className="texto_numero">Especialistas disponíveis</p>
        </div>
        <div className="media_pesquisa_10">
          <h1 className="numeros">+10</h1>
          <p className="texto_numero">Anos no mercado</p>
        </div>
      </div>

      <div className="container-sobre-nos">
        <div className="img-sobre">
          <img src={Foto} alt="" />
        </div>
        <div className="texto-sobre">
          <p>SOBRE NÓS</p>
          <div className="tit-entenda">
            <h1>Entenda quem somos e por que existimos</h1>
          </div>
          <div className="texto-entenda">
            <p>
              A FutureMind nasceu para democratizar o acesso à saúde emocional,
              oferecendo suporte psicológico de qualidade, com atendimento
              humanizado e personalizado para cada pessoa.
            </p>
          </div>
        </div>
      </div>

      <div className="container-planos">
        <h1 className="titulo-planos">Escolha seu plano</h1>
        <div className="planos-cards">
          <div className="card-plano">
            <img src={mensal} alt="Plano 1" className="imagem-plano" />
            <h2>Assinatura Prata</h2>
            <h3>R$ 189,99</h3>
            <p>Mensal</p>
            <p>
              Ideal para quem busca flexibilidade e acesso completo mês a mês.
            </p>
            <button className="btn-cadastro" onClick={abrirModalPrata}>
              Cadastre-se
            </button>
          </div>
          <div className="card-plano">
            <img src={trimestral} alt="Plano 2" className="imagem-plano" />
            <h2>Assinatura Ouro</h2>
            <h3>R$ 459,99</h3>
            <p>Trimestral</p>
            <p>Garanta três meses de acompanhamento psicológico contínuo.</p>
            <button className="btn-cadastro" onClick={abrirModalOuro}>
              Cadastre-se
            </button>
          </div>
          <div className="card-plano">
            <img src={empresarial} alt="Plano 3" className="imagem-plano" />
            <h2>Assinatura Empresarial</h2>
            <h3>Solicitar Plano</h3>
            <p>Personalizado</p>
            <p>
              Soluções personalizadas para empresas que valorizam o bem-estar
              emocional.
            </p>
            <button className="btn-cadastro" onClick={abrirModal}>
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
      <Modal open={modalAberto} >
      <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Cadastro Empresarial</h2>

            <section className="modal-section">
              <div className="input-container">
                <input
                  type="text"
                  id="emailEmpresarial"
                  required
                  className="modal-input"
                  value={emailEmpresa}
                  onChange={(e) => setEmailEmpresa(e.target.value)}
                />
                <label>E-mail Empresarial</label>
                {erroEmail && <p className="mensagem-erro">{erroEmail}</p>}
              </div>

              <div className="input-container">
                <input
                  type="password"
                  id="senhaEmpresarial"
                  required
                  maxLength={8}
                  className="modal-input"
                  value={senhaEmpresa}
                  onChange={(e) => setSenhaEmpresa(e.target.value)}
                />
                <label>Senha Empresarial</label>
                {erroSenha && <p className="mensagem-erro">{erroSenha}</p>}
              </div>
            </section>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={fecharModal}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarCadastro}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={modalPrataAberto} >
      <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Assinatura Prata</h2>
            <section className="modal-section">
              <ul className="modal-lista">
                <li>4 consultas individuais (1 por semana durante 1 mês);</li>
                <li>Liberdade de consultar com vários profissionais;</li>
                <li>
                  Ideal para quem está começando o acompanhamento psicológico;
                </li>
                <li>Após um mês renovar cadastro de plano.</li>
              </ul>
              <p className="modal-destaque">
                Recomendado para quem deseja um progresso emocional consistente
                e profundo.
              </p>
            </section>
            {carregandoPlano ? (
              <p className="modal-destaque">Carregando ...</p>
            ) : (
              <div className="modal-buttons">
                <button className="btn-cancelar" onClick={fecharModalPrata}>
                  Cancelar
                </button>
                <button className="btn-confirmar" onClick={confirmarPlano}>
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal open={modalOuroAberto} >
      <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Assinatura Ouro</h2>
            <section className="modal-section">
              <ul className="modal-lista">
                <li>
                  12 consultas individuais (1 por semana durante 3 meses);
                </li>
                <li>Liberdade de consultar com vários profissionais;</li>
                <li>Acompanhamento psicológico contínuo;</li>
                <li>Após três meses renovar cadastro de plano.</li>
              </ul>
              <p className="modal-destaque">
                Recomendado para quem deseja um progresso emocional consistente
                e profundo.
              </p>
            </section>
            {carregandoPlano ? (
              <p className="modal-destaque">Carregando ...</p>
            ) : (
              <div className="modal-buttons">
                <button className="btn-cancelar" onClick={fecharModalOuro}>
                  Cancelar
                </button>
                <button className="btn-confirmar" onClick={confirmarPlano}>
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Footer />
      {
        mostrarModalLogin &&
        <ModalLogin setMostrarModalLogin={setMostrarModalLogin} />
      }
    </div>
  );
}

export default Plano_saude;
