import NavBar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Context/GlobalContext.jsx";
import Select from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import fundo from "../assets/fundo inicio.svg";
import icon from "../assets/icon-profile.svg";
import animationData from "../assets/wired-flat-112-book-morph-open.json";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./CSS/Inicio.css";

function Inicio() {
  const navigate = useNavigate();
  const { setId, paginaAnterior, setPaginaAnterior, user } = useContext(GlobalContext);
  const userName = user?.nome?.split(' ')[0];

  const [profissionais, setProfissionais] = useState([]);
  const [valorBuscar, setValorBuscar] = useState("");
  const [mostrarLogo, setMostrarLogo] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [filtrados, setFiltrados] = useState([]);
  const [select_filtrados, setSelect_filtrados] = useState([]);
  const [especializacoes, setEspecializacoes] = useState([]);
  const [abordagens, setAbordagens] = useState([]);
  const [especializacaoValida, setEspecializacaoValida] = useState(true);
  const [abordagemValida, setAbordagemValida] = useState(true);
  const [filtrosAplicadosEspecializacoes, setFiltrosAplicadosEspecializacoes] = useState([]);
  const [filtrosAplicadosAbordagens, setFiltrosAplicadosAbordagens] = useState([]);

  const [animationOptions] = useState({
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
  });

  const opcoesEspecializacao = [
    { value: "psicologia-clinica", label: "Psicologia Clínica" },
    { value: "psicopedagogia", label: "Psicopedagogia" },
    { value: "neuropsicologia", label: "Neuropsicologia" }
  ];

  const opcoesAbordagens = [
    { value: "cognitivo-comportamental", label: "Cognitivo-Comportamental" },
    { value: "psicanalise", label: "Psicanálise" },
    { value: "humanista", label: "Humanista" }
  ];

  useEffect(() => {
    setTimeout(() => setPaginaAnterior('Inicio'), 2300);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => 
      setMostrarLogo(false), 
      paginaAnterior === 'Login' || paginaAnterior === 'Perfil' ? 2200 : 500
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const buscaProfissionais = async () => {
      try {
        const response = await fetch("https://futuremind-2-0.onrender.com");
        if (response.ok) {
          const data = await response.json();
          const profissionaisTratados = data.map((p) => ({
            ...p,
            especializacao: parseJson(p.especializacao),
            abordagem: parseJson(p.abordagem),
            sobre_mim: p.sobre_mim || ""
          }));
          setProfissionais(profissionaisTratados);
        }
      } catch (err) {
        console.log("Erro ao buscar profissionais:", err);
      }
    };
    buscaProfissionais();
  }, []);

  const parseJson = (valor) => {
    try {
      let parsed = typeof valor === "string" ? JSON.parse(valor) : valor;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "object" && item.label && item.value) return item;
          const labelFormatado = item.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          return { value: item, label: labelFormatado };
        });
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const acessarPerfil = (id) => {
    navigate(`/profissional/${id}`);
    setId(id);
  };

  const valor_input_buscar = (e) => {
    const valor = e.target.value;
    setValorBuscar(valor);
    if (valor === "") {
      setFiltrados([]);
    } else {
      const filtrados = profissionais.filter((nome) =>
        nome.nome.toLowerCase().includes(valor.toLowerCase())
      );
      setFiltrados(filtrados);
    }
  };

  const selecionarUsuario = (profi) => {
    setValorBuscar(profi.nome);
    setFiltrados([]);
    acessarPerfil(profi.id_profissional);
  };

  const aplicarFiltro = () => {
    setFiltrosAplicadosEspecializacoes(especializacoes);
    setFiltrosAplicadosAbordagens(abordagens);
  };

  return (
    <>
      {mostrarLogo ? (
        <div className="logo-container">
          <div className="logo-elements">
            {(paginaAnterior==='Perfil' && !user) || paginaAnterior==='Login' ? (
              <img src="logo oficial.svg" alt="Logo" className="logo-animada" />
            ) : (
              <h2 className="loading-animation">Carregando...</h2>    
            )}
          </div>
        </div>
      ) : (
        <div className="container-inicio">
          <NavBar />
          <div className="img-fundo">
            <img src={fundo} alt="" />
          </div>

          <div className="filter-profissionais-div">
            <div className="filter-profissionais-text">
              <h1>{!user ? 'Encontre seu profissional.' : `Olá, ${userName}!`}</h1>
              {user && <img src='hello (1).png' />}
            </div>

            <div className="filter-background">
              <div className="filter-profissionais-container">
                <div className="filtros-profissionais">
                  <div className="inpt-filtro">
                    <input
                      type="text"
                      placeholder="Buscar profissional..."
                      onChange={valor_input_buscar}
                    />
                    <img src="search.png" alt="" />
                  </div>
                  <div className="div-filtro">
                    <div className="select-filtro">
                      <Select
                        placeholder="Especialização"
                        className="custom-select"
                        classNamePrefix="select"
                        options={opcoesEspecializacao}
                        isMulti
                        onChange={(selectedOptions) => {
                          const opcoes = selectedOptions || [];
                          setEspecializacoes(opcoes);
                          setEspecializacaoValida(opcoes.length > 0);
                        }}
                        value={especializacoes}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      />
                    </div>
                    <div className="select-filtro">
                      <Select
                        placeholder="Abordagem"
                        className="custom-select"
                        classNamePrefix="select"
                        options={opcoesAbordagens}
                        isMulti
                        onChange={(selectedOptions) => {
                          const opcoes = selectedOptions || [];
                          setAbordagens(opcoes);
                          setAbordagemValida(opcoes.length > 0);
                        }}
                        value={abordagens}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      />
                    </div>
                  </div>
                </div>
                <div className="container_filtrados">
                  {filtrados.length > 0 && (
                    <div className="filtrados">
                      {filtrados.map((nome, index) => (
                        <div
                          className="nomes_filtrados"
                          key={index}
                          onClick={() => selecionarUsuario(nome)}
                        >
                          {nome.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-profissionais-baixo">
                  <div className="plano-saude-img">
                    <Link to="/planoSaude">
                      <img src="planoSaude.svg" alt="" />
                    </Link>
                  </div>
                  <div className="div-filtrar">
                    <div className="text-btn-filtro">
                      Selecione os botões acima para escolher a especialidade e o
                      assunto desejado para a sua consulta.
                    </div>
                    <div className="text-btn-filtro">
                      Em seguida, clique no botão para filtrar os profissionais mais
                      adequados para você.
                    </div>
                    <div onClick={aplicarFiltro} className="div-btn-filtro">
                      <button className="btn-filtro" onClick={aplicarFiltro}>
                        Filtrar
                      </button>
                      <img onClick={aplicarFiltro} src="filter-icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="resultados-container">
            <div className="resultado-texto-anota">
              <div className="resultado-frase">
                <h2>Resultados</h2>
              </div>
            </div>

            <div className="swiper-wrapper-container">
              <div className="swiper-button-prev-custom">‹</div>
              <div className="swiper-filho">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={3}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom"
                  }}
                  pagination={{ clickable: true }}
                  className="swiper-profi"
                >
                  {Array.isArray(profissionais) && profissionais.length > 0 &&
                    (filtrosAplicadosEspecializacoes.length > 0 || filtrosAplicadosAbordagens.length > 0
                      ? profissionais.filter((p) => {
                          const matchEspecializacao = filtrosAplicadosEspecializacoes.length > 0 &&
                            p.especializacao.some((esp) =>
                              filtrosAplicadosEspecializacoes.some(
                                (sel) => sel.value === esp.value
                              )
                            );

                          const matchAbordagem = filtrosAplicadosAbordagens.length > 0 &&
                            p.abordagem.some((abo) =>
                              filtrosAplicadosAbordagens.some(
                                (sel) => sel.value === abo.value
                              )
                            );
                          
                          return matchEspecializacao || matchAbordagem;
                        })
                      : profissionais
                    ).map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="card">
                          <div className="foto-perfilInicio">
                            <img 
                              src={item.foto?.startsWith('/') 
                                ? `https://futuremind-2-0.onrender.com${item.foto}`
                                : item.foto || icon} 
                              alt="Foto do profissional" 
                            />
                            <div className="perfil-nomeValor">
                              <h2 onClick={() => acessarPerfil(item.id_profissional)}>
                                {item.nome}
                              </h2>
                              <p>{item.valor_consulta!== null && `R$ ${item.valor_consulta}`}</p>
                            </div>
                          </div>
                          <div className="div-especializacao">
                            {item?.especializacao?.map((item, index) => (
                              <div className="container_especializacao" key={index}>
                                <p className="especializacao-style">{item.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="sobremim-inicio">
                            <h3>Sobre mim:</h3>
                            <div className="textSobremim">
                              <p>{item?.sobre_mim}</p>
                            </div>
                          </div>
                          <div className="sobremim-inicio">
                            <h3>Abordagens:</h3>
                            <div className="textSobremimm">
                              {Array.isArray(item?.abordagem) &&
                                item.abordagem.map((item, index) => (
                                  <p key={index}>{item.label}</p>
                                ))}
                            </div>
                            <div className="crp-inicio">CRP {item.crp}</div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <div className="swiper-button-next-custom">›</div>
            </div>
          </div>

          <div className="footer_inicio">
            <Footer className="footer_inicio" />
          </div>
        </div>
      )}
    </>
  );
}

export default Inicio;