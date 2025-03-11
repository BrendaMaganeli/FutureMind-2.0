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
    </div>
  )
}

export default Inicio