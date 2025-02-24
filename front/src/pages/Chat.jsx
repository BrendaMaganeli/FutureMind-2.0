import './CSS/Chat.css';
import voltar from '../assets/voltar 2.svg';
import config from '../assets/settings.svg';
import help from '../assets/help 1.svg';
import mulher from '../assets/image 8.png';

function Chat() {

    const chats = [
    {
        nome: 'Vitor Azevedo', 
        foto: mulher
    }, 
    {
        nome: 'Lúcia Katia',
        foto: mulher
    },
    {
        nome: 'Lúcia Katia',
        foto: mulher
    },
    {
        nome: 'Lúcia Katia',
        foto: mulher
    },
    {
        nome: 'Lúcia Katia',
        foto: mulher
    },
    {
        nome: 'Lúcia Katia',
        foto: mulher
    },
    {
        nome: 'Lúcia Katia',
        foto: mulher
    },
    {
        nome: 'Lúcia Katia',
        foto: mulher
    }
];

  return (
    <div className="container-chats">
        <div className="barra-lateral-chat">
            <div className="barra-cima">
                <img src={voltar} alt="" />
                <img src={config} alt="" />
            </div>
            <div className="barra-baixo">
                <img src={help} alt="" />
            </div>
        </div>
        <div className="chats">
            <div className="cabecalho-chats">
                <p>Chats</p>
            </div>
            <div className="pesquisa-chats">
                <div className="input-pesquisa">
                    <input type="text" />
                </div>
                <div className="boxs-pesquisa">
                    <div className="box-pesquisa">3 não lidas</div>
                    <div className="box-pesquisa">A-Z</div>
                    <div className="box-pesquisa">Antigas</div>
                </div>
            </div>
            <div className="conversas">
                {
                    chats.map((item, index) => (

                        <div key={index} className="chat-barra">
                            <img src={item.foto} alt="" />
                            <div className="nome">
                                <p>{item.nome}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="barra-final"></div>
        </div>
        <div className="chat">a</div>
          
        <div className="arvore-chat">
            <img src="Arvore Perfil.png" alt="" />
        </div>
    
    </div>
  );
};

export default Chat;