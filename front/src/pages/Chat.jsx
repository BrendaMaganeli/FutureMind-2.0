import './CSS/Chat.css';
import voltar from '../assets/voltar 2.svg';
import config from '../assets/settings.svg';
import help from '../assets/help 1.svg';

function Chat() {

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
                    <div className="box-pesquisa">Classificar A-Z</div>
                    <div className="box-pesquisa">Antigas</div>
                </div>
            </div>
            <div className="conversas"></div>
            <div className="barra-final"></div>
        </div>
        <div className="chat">a</div>
    </div>
  );
};

export default Chat;