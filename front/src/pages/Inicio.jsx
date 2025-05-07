import NavBar from "../Components/Navbar.jsx";
import fundo from "../assets/fundo inicio.svg";
import "./CSS/Inicio.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination } from "swiper/modules";
import foto from "../assets/fotoInicio.svg";
import Lottie from "react-lottie";
import animationData from "../assets/wired-flat-112-book-morph-open.json";
import { useEffect, useState } from "react";
import Select from "react-select";

function Inicio() {
  const [profissionais, setProfissionais] = useState([]);

  const buscaProfissionais = async () => {
    try {
      const response = await fetch("http://localhost:4242");

      if (response.ok) {
        const data = await response.json();

        setProfissionais(data);
        console.log(Array.isArray(data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscaProfissionais();
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const [animationOptions, setAnimationOptions] = useState({
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  const opcoesEspecializacao = [
    { value: "psicologia-clinica", label: "Psicologia Clínica" },
    { value: "psicopedagogia", label: "Psicopedagogia" },
    { value: "neuropsicologia", label: "Neuropsicologia" },
  ];

  const opcoesAbordagens = [
    { value: "cognitivo-comportamental", label: "Cognitivo-Comportamental" },
    { value: "psicanalise", label: "Psicanálise" },
    { value: "humanista", label: "Humanista" },
  ];

  const [especializacoes, setEspecializacoes] = useState([]);
  const [abordagens, setAbordagens] = useState([]);
  const [especializacaoValida, setEspecializacaoValida] = useState(true);
  const [abordagemValida, setAbordagemValida] = useState(true);

  return (
    <div className="container-inicio">
      <NavBar />
      <div className="img-fundo">
        <img src={fundo} alt="" />
      </div>

      <div className="filter-profissionais-div">
        <div className="filter-profissionais-text">
          <h1>Encontre seu profissional</h1>
        </div>

        <div className="filter-background">
          <div className="filter-profissionais-container">
            <div className="filtros-profissionais">
              <div className="inpt-filtro">
                <input type="text" placeholder="Buscar profissional..." />
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
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
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
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
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
                <div className="div-btn-filtro">
                  <button className="btn-filtro">Filtrar</button>
                  <img src="filter-icon.svg" alt="" />
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
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{ clickable: true }}
              className="swiper-profi"
            >
              {Array.isArray(profissionais) &&
                profissionais.length > 0 &&
                profissionais?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="card">
                      <div className="foto-perfilInicio">
                        <img src={foto} alt="" />
                        <div className="perfil-nomeValor">
                          <h2>{item.nome}</h2>
                          <p>R$ 50/60 min</p>
                        </div>
                      </div>
                      <div className="div-especializacao">
                        <p className="especializacao-style">Adolecencia</p>
                        <p className="especializacao-style">Idosos</p>
                        <p className="especializacao-style">Crianças</p>
                        <p className="especializacao-style">Crianças</p>
                      </div>
                      <div className="sobremim-inicio">
                        <h3>Sobre mim:</h3>
                        <div className="textSobremim">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Dolore, voluptates ducimus consectetur
                          praesentium temporibus ut veniam nesciunt incidunt
                          reprehenderit, deserunt, cupiditate eaque cumque magni
                          nobis omnis? Iure temporibus doloribus libero?
                        </div>
                      </div>
                      <div className="sobremim-inicio">
                        <h3>Abordagens:</h3>
                        <div className="textSobremim">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Dolore, voluptates ducimus consectetur
                          praesentium temporibus ut
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
      <div className="botao-anota">
        <Link
          to="/diarioemocional"
          onMouseEnter={() => setIsHovered(true)} // Ativa a animação ao passar o mouse
          onMouseLeave={() => setIsHovered(false)} // Desativa a animação ao tirar o mouse
        >
          <Lottie
            options={animationOptions}
            height={60}
            width={60}
            isPaused={false}
            speed={0.4} // Tente diminuir mais a velocidade aqui
            isStopped={!isHovered} // A animação só acontece quando está "hovering"
          />
        </Link>
      </div>
    </div>
  );
}

export default Inicio;
