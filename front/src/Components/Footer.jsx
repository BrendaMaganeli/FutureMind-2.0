import "./CSS/Footer.css";
import Instagram from "../assets/instagram 1.svg";
import Facebook from "../assets/facebook 1.svg";
import Youtube from "../assets/youtube 1.svg";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="container-footer">
      <div className="container-titulo">
        <p>Future</p>
        <h1>Mind</h1>
      </div>
      <div className="container-geral_info">
        <div className="container-direitos">
          <p>©2025 - FutureMind</p>
          <p>Todos os direitos reservados.</p>
        </div>
<<<<<<< HEAD
        <div className='container-redes'>
           <Link to={'https://www.instagram.com/futuremind.tech/'}><img src={Instagram} alt="" /></Link>
           <Link><img src={Facebook} alt="" /></Link>
           <Link to={'https://www.youtube.com/'}><img src={Youtube} alt="" /></Link>
=======
        <div className="container-redes">
          <Link>
            <img src={Instagram} alt="" />
          </Link>
          <Link>
            <img src={Facebook} alt="" />
          </Link>
          <Link to={"https://www.youtube.com/"}>
            <img src={Youtube} alt="" />
          </Link>
>>>>>>> 838539c4b6e0b27ad7d2975670a433f781c5b3fa
        </div>
      </div>
    </div>
  );
}

export default Footer;
