import NavBar from '../Components/Navbar.jsx';
import fundo from '../assets/fundo inicio.svg';
import './CSS/Inicio.css';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import Footer from '../Components/Footer.jsx';

function Inicio() {
  return (
    <div className='container-inicio'>
        <NavBar />
        <div className="img-fundo">
            <img src={fundo} alt="" />
        </div>
        <div className="filter-profissionais-div">
          <div className="filter-profissionais-text">
            <h1>Encontre seu profissional</h1>
          </div>
          <div className='filter-background'>
          <div className="filter-profissionais-container">
            <div className="filtros-profissionais">
              <div className="inpt-filtro">
                <img src='search.png' alt="" />
                <input type='text' placeholder='Buscar profissional...' />
              </div>
              <div style={{display: 'flex', width: '100%'}}>
                <div className="especialidade-filtro">
                  <select name="" id="">
                    <option value="">Especialidade</option>
                    <option value="">b</option>
                    <option value="">c</option>
                    <option value="">d</option>
                  </select>
                </div>
                <div className="abordagem-filtro">
                  <select name="" id="">
                    <option value="">Abordagem</option>
                    <option value="">b</option>
                    <option value="">c</option>
                    <option value="">d</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="filter-profissionais-baixo">
              <div className="plano-saude-img">
                <img src='planoSaude.svg' alt='' />
              </div>
              <div className="div-filtrar">
                <div className="text-btn-filtro">Selecione os botões acima para escolher a especialidade e o assunto desejado para a sua consulta. Em seguida, clique no botão para filtrar os profissionais mais adequados para você.</div>
                <div className="div-btn-filtro">
                  <button className="btn-filtro">Filtrar</button>
                  <img src='filter-icon.svg' alt='' />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className="resultados-container">
            <div className="resultado-dois-de-cima">
          <div className="resultado-texto-anota">
            <div className="resultado-frase">
                <h1>Resultados</h1>
            </div>
            <div className="botao-anotacoes">
                <Link to='/diarioemocional'>
                    <img src='botao-anota.svg' alt='' />
                </Link>
            </div>
            </div>
          {/* <div className="carrosel-profissional">
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={60}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                onSwiper={(swiper) => console.log("Swiper inicializado", swiper)}
                className='swiper-profi'
                >
                <div className="carousel">
                    {[...Array(6)].map((_, index) => (
                        <SwiperSlide className="card" key={index}>
                          <div className='card-interno'>Profissional {index + 1}</div>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
          </div> */}
          <div className="carrosel-profissional">

          <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={60}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                onSwiper={(swiper) => console.log("Swiper inicializado", swiper)}
                className='swiper-profi'
                >
                   {[...Array(6)].map((_, index) => (
                     <SwiperSlide className="card" key={index}>
                          <div className='card-interno'>Profissional {index + 1}</div>
                        </SwiperSlide>
                    ))}
              </Swiper>
              </div>
            </div>
        <Footer />
        </div>
      </div>
  )
}

export default Inicio;
