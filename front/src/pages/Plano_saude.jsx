import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { GlobalContext } from "../Context/GlobalContext.jsx";

import NavBar from "../Components/Navbar";
import Footer from "../Components/Footer.jsx";
import ModalLogin from "../Components/ModalLogin.jsx";
import Foto from "../assets/Pic.svg";
import mensal from "../assets/Mensal.svg";
import trimestral from "../assets/Trimestral.svg";
import empresarial from "../assets/empresarial.svg";

import "./CSS/Plano_saude.css";

function Plano_saude() {
  const navigate = useNavigate();
  const { 
    plano_selecionado, 
    setPlano_selecionado, 
    setVim_plano, 
    setVim_agendamento, 
    user, 
    setUser 
  } = useContext(GlobalContext);

  // Modal states
  const [modalAberto, setModalAberto] = useState(false);
  const [modalPrataAberto, setModalPrataAberto] = useState(false);
  const [modalOuroAberto, setModalOuroAberto] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [carregandoPlano, setCarregandoPlano] = useState(false);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  // Form states
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [senhaEmpresa, setSenhaEmpresa] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  // Plan states
  const [estadoPlano, setEstadoPlano] = useState();
  const [dataAr, setDataAr] = useState();
  const [assinatura, setAssinatura] = useState('');
  const [mostrarLogo, setMostrarLogo] = useState(true);

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (emailEmpresa.length > 0) setErroEmail(false);
  }, [emailEmpresa]);

  useEffect(() => {
    if (senhaEmpresa.length > 0) setErroSenha(false);
  }, [senhaEmpresa]);

  useEffect(() => {
    const pegar_data_fim = async () => {
      const id = user?.id_paciente;
      if (!id) return;

      try {
        const response = await fetch("https://futuremind-2-0.onrender.com/planos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          const data = await response.json();
          let dataAux = data.data_fim_assinatura.split('');
          dataAux[dataAux.length - 15] = `${parseInt(dataAux[dataAux.length - 15]) - 1}`;
          let newData = dataAux.join('');
          setDataAr(newData);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    pegar_data_fim();
  }, []);

  useEffect(() => {
    const rawDate = dataAr;
    const dataValida = new Date(rawDate);
    if (!rawDate || isNaN(dataValida.getTime())) return;

    const data_fim_assinatura = dataValida.toISOString().split("T")[0];
    const hoje = new Date().toISOString().split("T")[0];

    const mandar_data = async () => {
      if (data_fim_assinatura === hoje) {
        try {
          const response = await fetch("https://futuremind-2-0.onrender.com/validacao_planos", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_paciente: user.id_paciente,
              chk_plano: false,
            }),
          });

          if (response.ok) {
            setUser({...user, chk_plano: false});
          }
        } catch (error) {
          console.error("Erro ao validar plano:", error);
        }
      }
    };

    mandar_data();
  }, [dataAr]);

  useEffect(() => {
    const estado_plano = async () => {
      try {
        const response = await fetch("https://futuremind-2-0.onrender.com/estado_plano", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_paciente: user.id_paciente }),
        });

        if (response.ok) {
          const data = await response.json();
          setEstadoPlano(data.chk_plano);
        }
      } catch (error) {
        console.error("Erro ao pegar estado do plano:", error);
      }
    };

    if (user?.id_paciente) estado_plano();
  }, [user]);

  useEffect(() => {
    const valor_assinatura = async () => {
      try {
        const response = await fetch("https://futuremind-2-0.onrender.com/Valores_assinatura", {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_paciente: user.id_paciente }),
        });

        if (response.ok) {
          const data = await response.json();
          setAssinatura(data[0]);
        }
      } catch (error) {
        console.error("Erro ao pegar assinatura:", error);
      }
    };

    if (user?.id_paciente) valor_assinatura();
  }, [user]);

  // Modal handlers
  const abrirModalPrata = () => (!user ? setMostrarModalLogin(true) : setModalPrataAberto(true));
  const fecharModalPrata = () => setModalPrataAberto(false);

  const abrirModalOuro = () => (!user ? setMostrarModalLogin(true) : setModalOuroAberto(true));
  const fecharModalOuro = () => setModalOuroAberto(false);

  const abrirModal = () => {
    if (user) {
      setModalAberto(true);
      setEmailEmpresa("");
      setSenhaEmpresa("");
    } else {
      setMostrarModalLogin(true);
    }
  };

  const fecharModal = () => setModalAberto(false);
  const abrirModalCancelar = () => setModalCancelarAberto(true);
  const fecharModalCancelar = () => setModalCancelarAberto(false);

  // Plan handlers
  const confirmarCadastro = async () => {
    setPlano_selecionado("empresarial");

    if (!user) {
      setModalAberto(false);
      return;
    }

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
    fecharModal();

    try {
      const hoje = new Date();
      const body = {
        fk_id_paciente: user.id_paciente,
        tipo_assinatura: plano_selecionado,
        data_assinatura: hoje.toISOString().split("T")[0],
      };

      const response = await fetch("https://futuremind-2-0.onrender.com/plano_empressarial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log("Plano empresarial cadastrado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar plano empresarial:", error);
    }
  };

  const selecionar_plano_prata = () => {
    setPlano_selecionado("prata");

    if (user) {
      setCarregandoPlano(true);
      setTimeout(() => {
        setCarregandoPlano(false);
        fecharModalPrata();
        navigate(`/pagamento/${user.id_paciente}?vim_plano=true`);
      }, 1500);
      setVim_plano(true);
      setVim_agendamento(false);
    } else {
      setModalPrataAberto(false);
    }
  };

  const selecionar_plano_ouro = () => {
    setPlano_selecionado("ouro");

    if (user) {
      setCarregandoPlano(true);
      setTimeout(() => {
        setCarregandoPlano(false);
        fecharModalOuro();
        navigate(`/pagamento/${user.id_paciente}?vim_plano=true`);
      }, 1500);
      setVim_plano(true);
      setVim_agendamento(false);
    } else {
      setModalOuroAberto(false);
    }
  };

  const cancelarPlano = async () => {
    if (!user?.id_paciente) return;

    setCancelando(true);

    try {
      const responseDelete = await fetch("https://futuremind-2-0.onrender.com/remover_assinatura", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_paciente: user.id_paciente }),
      });

      if (!responseDelete.ok) throw new Error("Erro ao remover assinatura");

      const responsePut = await fetch("https://futuremind-2-0.onrender.com/atualizar_chk_plano", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_paciente: user.id_paciente, chk_plano: false }),
      });

      if (!responsePut.ok) throw new Error("Erro ao atualizar plano");

      setUser({ ...user, chk_plano: false });
      setEstadoPlano(false);
      setAssinatura({});
      fecharModalCancelar();
    } catch (error) {
      console.error(error);
    } finally {
      setCancelando(false);
    }
  };

  // Helper functions
  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const navega = () => navigate("/inicio");

  return (
    <>
      {mostrarLogo ? (
        <div className="logo-container">
          <div className="logo-elements">
            <h2 className="loading-animation">Carregando...</h2>    
          </div>
        </div>
      ) : (
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
                    AGENDE COM PROFISSIONAL
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
              <h1 className="numeros">+15.000</h1>
              <p className="texto_numero">Especialistas disponíveis</p>
            </div>
            <div className="media_pesquisa_10">
              <h1 className="numeros">+10</h1>
              <p className="texto_numero">Anos no mercado</p>
            </div>
          </div>

          <div className="container-sobre-nos">
            <div className="img-sobre">
              <img src={Foto} alt="Imagem sobre nós" />
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

          {(!user || (user?.id_paciente && !estadoPlano)) && (
            <>
              <div className="container-planos">
                <h1 className="titulo-planos">Escolha seu plano</h1>
                <div className="planos-cards">
                  <div className="card-plano">
                    <img src={mensal} alt="Plano 1" className="imagem-plano" />
                    <h2>Assinatura Prata</h2>
                    <h3>R$ 189,99</h3>
                    <p>Mensal</p>
                    <p>
                      Ideal para quem busca flexibilidade e acesso completo mês a
                      mês.
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
                    <p>
                      Garanta três meses de acompanhamento psicológico contínuo.
                    </p>
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
                      Soluções personalizadas para empresas que valorizam o
                      bem-estar emocional.
                    </p>
                    <button className="btn-cadastro" onClick={abrirModal}>
                      Cadastre-se
                    </button>
                  </div>
                </div>
              </div>

              <Modal open={modalAberto}>
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

              <Modal open={modalPrataAberto}>
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2 className="modal-title">Assinatura Prata</h2>
                    <section className="modal-section">
                      <ul className="modal-lista">
                        <li>4 consultas individuais (1 por semana durante 1 mês);</li>
                        <li>Liberdade de consultar com vários profissionais;</li>
                        <li>Ideal para quem está começando o acompanhamento psicológico;</li>
                        <li>Após um mês renovar cadastro de plano.</li>
                      </ul>
                      <p className="modal-destaque">
                        Recomendado para quem deseja um progresso emocional
                        consistente e profundo.
                      </p>
                    </section>
                    {carregandoPlano ? (
                      <p className="modal-destaque">Carregando ...</p>
                    ) : (
                      <div className="modal-buttons">
                        <button className="btn-cancelar" onClick={fecharModalPrata}>
                          Cancelar
                        </button>
                        <button className="btn-confirmar" onClick={selecionar_plano_prata}>
                          Confirmar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Modal>

              <Modal open={modalOuroAberto}>
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2 className="modal-title">Assinatura Ouro</h2>
                    <section className="modal-section">
                      <ul className="modal-lista">
                        <li>12 consultas individuais (1 por semana durante 3 meses);</li>
                        <li>Liberdade de consultar com vários profissionais;</li>
                        <li>Acompanhamento psicológico contínuo;</li>
                        <li>Após três meses renovar cadastro de plano.</li>
                      </ul>
                      <p className="modal-destaque">
                        Recomendado para quem deseja um progresso emocional
                        consistente e profundo.
                      </p>
                    </section>
                    {carregandoPlano ? (
                      <p className="modal-destaque">Carregando ...</p>
                    ) : (
                      <div className="modal-buttons">
                        <button className="btn-cancelar" onClick={fecharModalOuro}>
                          Cancelar
                        </button>
                        <button className="btn-confirmar" onClick={selecionar_plano_ouro}>
                          Confirmar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Modal>
            </>
          )}

          {user?.id_paciente && estadoPlano === 1 && (
            <div className="container_estado_plano">
              <div className="estado_plano_esq">
                <img className="img_estado_plano" src={trimestral} alt="Plano trimestral" />
              </div>
              <div className="estado_plano_dir">
                <h1 className="titulo_plano">Plano {assinatura.tipo_assinatura} Ativo</h1>
                <ul className="lista_plano"> 
                  <li><strong>Data de assinatura:</strong> {formatarData(assinatura.data_assinatura)}</li>
                  <li><strong>Data de fim do plano:</strong> {formatarData(assinatura.data_fim_assinatura)}</li>
                  <li><strong>Consultas disponíveis:</strong> {assinatura.consultas_disponiveis}</li>
                </ul>
                <div className="container_button_plano_cancelar">
                  <button className="button_plano_cancelar" onClick={abrirModalCancelar}>
                    Cancelar plano
                  </button>
                </div>
              </div>
            </div>
          )}

          <Modal open={modalCancelarAberto} onClose={fecharModalCancelar}>
            <div className="modal-overlay-cancelar">
              <div className="modal-content-cancelar">
                <h2 className="modal-title-cancelar">Confirmar Cancelamento</h2>
                <p className="p_cancelar">Tem certeza que deseja cancelar seu plano?</p>
                <div className="modal-buttons-cancelar">
                  <button className="btn-cancelar" onClick={fecharModalCancelar} disabled={cancelando}>
                    Não
                  </button>
                  <button className="btn-confirmar" onClick={cancelarPlano} disabled={cancelando}>
                    {cancelando ? "Cancelando..." : "Sim, cancelar"}
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          <Footer />

          {mostrarModalLogin && (
            <ModalLogin setMostrarModalLogin={setMostrarModalLogin} />
          )}
        </div>
      )}
    </>
  );
}

export default Plano_saude;