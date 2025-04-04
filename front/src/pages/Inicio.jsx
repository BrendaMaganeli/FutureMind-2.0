import NavBar from '../Components/Navbar.jsx';
import fundo from '../assets/fundo inicio.svg';
import './CSS/Inicio.css';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination } from 'swiper/modules';
import foto from '../assets/fotoInicio.svg'

function Inicio() {

  const profissionais = Array(8).fill(null);

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
                <div className="text-btn-filtro">Selecione os botões acima para escolher a especialidade e o assunto desejado para a sua consulta.</div>
                <div className="text-btn-filtro"> Em seguida, clique no botão para filtrar os profissionais mais adequados para você.</div>
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
            <div className="resultado-texto-anota">
              <div className="resultado-frase">
                <h2>Resultados</h2>
              </div>
              <div className="botao-anota">
                <Link to='/diarioemocional'>
                  <img src='botao-anota.svg' />
                </Link>
              </div>
            </div>
            <div className="swiper">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: false }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                className='swiper-profi'
              >
                {
                  profissionais.map((item, index) => (

                    <SwiperSlide key={index}>
                      <div className="card">
                        {item}
                        <div className='foto-perfilInicio'>
                        <img src={foto} alt="" /> 
                        <div className='perfil-nomeValor'>
                        <h2>João Pedro Garcia</h2>
                        <p>R$ 50/60 min </p>
                        </div>
                        </div>
                        <div className='div-especializacao'>
                          <p className='especializacao-style'>Adolecencia</p> 
                          <p className='especializacao-style'>Idosos</p> 
                          <p className='especializacao-style'>Crianças</p>
                          <p className='especializacao-style'>Crianças</p>
                        </div>
                        <div className='sobremim-inicio'>
                          <h3>Sobre mim:</h3>
                          <div className='textSobremim'>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, voluptates ducimus consectetur praesentium temporibus ut veniam nesciunt incidunt reprehenderit, deserunt, cupiditate eaque cumque magni nobis omnis? Iure temporibus doloribus libero?
                          </div>
                        </div>
                        <div className='sobremim-inicio'>
                          <h3>Abordagens:</h3>
                          <div className='textSobremim'>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, voluptates ducimus consectetur praesentium temporibus ut 
                          </div>
                          <div className='crp-inicio'>
                            CRP 98/12345
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>

        </div>
      </div>
  )
}

export default Inicio;
