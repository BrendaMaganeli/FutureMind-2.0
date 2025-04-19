import icon from '../assets/icon-profile.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import './CSS/NavBar.css';

function Navbar({ cor }) {
  const location = useLocation();
  const [underlineStyle, setUnderlineStyle] = useState({});
  const linksRef = useRef([]);

  useEffect(() => {
    const activeLink = linksRef.current.find(link => link?.classList.contains('active'));
    if (activeLink) {
      setUnderlineStyle({
        width: `${activeLink.offsetWidth}px`,
        left: `${activeLink.offsetLeft}px`,
      });
    }
  }, [location.pathname]); // Atualiza ao mudar de rota

  return (
    <div className='container-nav' style={{ backgroundColor: cor }}>
      <div className='container_logo'>
        <Link to='/'>
          <img src="Logo_sa_arvore.svg" alt="Logo" />
        </Link>
      </div>
      <div className='container-links'>
        <div className="underline" style={underlineStyle}></div>
        <NavLink to="/inicio" end ref={el => linksRef.current[0] = el}>Início</NavLink>
        <NavLink to="/planoSaude" ref={el => linksRef.current[2] = el}>Planos</NavLink>
        <NavLink to="/chats" ref={el => linksRef.current[3] = el}>
          Chats <img src="logo_chat.svg" alt="Chat" className='chatbalao' />
        </NavLink>
      </div>
      <div className='container-icon'>
        <img src={icon} alt="Perfil" />
      </div>
    </div>
  );
}

export default Navbar;
