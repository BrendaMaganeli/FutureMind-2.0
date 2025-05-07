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
        </div>
      </div>
    </div>
  );
}

export default Footer;
