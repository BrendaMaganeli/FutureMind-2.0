
import { Link } from 'react-router-dom';
import './CSS/Navbar.css'

function Navbar({cor}) {
  return (
      <div className='container-nav' style={{backgroundColor: cor}}>
       <div className='container_logo'>
        <img src="Logo_sa_arvore.svg" alt="" />
       </div>
       <div className='container-links'>
        <Link>Inicio</Link>
        <Link>Sobre</Link>
        <Link to='/planoSaude'>Planos</Link>
        <Link to='/chats'>Chats<img src="logo_chat.svg" alt="" className='chatbalao'/></Link>
       </div>
       <div className='container-icon'>
        <img src="logo_usuario.svg" alt="" />
       </div>
      </div>
      
    
  )
}

export default Navbar