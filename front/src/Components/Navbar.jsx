import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import iconeUsuario from "../assets/iconusu.svg";
import ModalLogin from "./ModalLogin";
import "./CSS/NavBar.css";
import { GlobalContext } from "../Context/GlobalContext";

function Navbar({ cor }) {
  const location = useLocation();
  const [underlineStyle, setUnderlineStyle] = useState({});
  const linksRef = useRef([]);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

  const { user } = useContext(GlobalContext);

  useEffect(() => {
    const activeLink = linksRef.current.find((link) =>
      link?.classList.contains("active"),
    );
    if (activeLink) {
      setUnderlineStyle({
        width: `${activeLink.offsetWidth}px`,
        left: `${activeLink.offsetLeft}px`,
      });
    }
  }, [location.pathname]); // Atualiza ao mudar de rota

  const handleClick = () => {

    if (!user) {

      setMostrarModalLogin(true);
    }
  }

  return (
    <div className="container-nav" style={{ backgroundColor: cor }}>
      <div className="container_logo">
        <Link to="/">
          <img src="logo oficial.svg" alt="Logo" />
        </Link>
      </div>
      <div className="container-links">
        <div className="underline" style={underlineStyle}></div>
        <NavLink to="/inicio" end ref={el => linksRef.current[0] = el}>Profissionais</NavLink>
        
        <NavLink to="/planoSaude" ref={el => linksRef.current[2] = el}>Planos</NavLink>
        <a onClick={handleClick} href={user && '/chats'} ref={el => linksRef.current[3] = el}>
          Chats <img src="logo_chat.svg" alt="Chat" className='chatbalao' />
        </a>
      </div>
      <div className="container-icon">
        <Link to={user?.id_profissional ? "/editarprofissional" : user?.id_paciente ? '/paciente' : "/login"}>
          <img src={!user?.foto || location.pathname === '/planoSaude' ? iconeUsuario : !user?.foto ? 'icone_usuario.svg' : ((user?.foto === 'icone_usuario.svg' || user?.foto?.startsWith('data')) && location.pathname === '/planoSaude') ? iconeUsuario : user?.foto === 'icone_usuario.svg' || user?.foto?.startsWith('http') ? user?.foto : user?.foto?.startsWith('data') ? 'icone_usuario.svg' : `https://futuremind-2-0.onrender.com${user?.foto}`} alt="Perfil" />
        </Link>
      </div>
      {mostrarModalLogin && 
        <ModalLogin setMostrarModalLogin={setMostrarModalLogin} />
      }
    </div>
  );
}

export default Navbar;
