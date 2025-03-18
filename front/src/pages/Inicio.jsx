import NavBar from '../Components/Navbar.jsx';
import fundo from '../assets/fundo inicio.svg';
import './CSS/Inicio.css';

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
                <img src='planoSaude.svg' />
              </div>
              <div className="div-filtrar">
                <div className="text-btn-filtro">Selecione os botões acima para escolher a especialidade e o assunto desejado para a sua consulta. Em seguida, clique no botão para filtrar os profissionais mais adequados para você.</div>
                <div className="div-btn-filtro">
                  <button className="btn-filtro">Filtrar</button>
                  <img src='filter-icon.svg' />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className="resultados-container">
          <h1>Resultados</h1>
          <div className="carrosel-profissional">
            <div className="carousel">
              <button className="prev">&#10094;</button>
              <div className="card"></div>
              <div className="card"></div>
              <div className="card"></div>
              <button className="next">&#10095;</button>
          </div>
          </div>
        </div>
      </div>
  )
}

export default Inicio