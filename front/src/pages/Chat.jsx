import voltar from '../assets/voltar 2.svg';
import config from '../assets/settings.svg';
import help from '../assets/help 1.svg';
import mulher from '../assets/image 8.png';
import arvore from '../assets/Logo Para o Navegador do Google 3.svg';
import lupa from '../assets/search 1.svg';
import { useState } from 'react';
import close from '../assets/Group 239210.svg';
import cam from '../assets/cam-recorder (1) 1.svg';
import block from '../assets/blocked 1.svg';
import './CSS/Chat.css';

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
];

const [filters, setFilters] = useState([
    { text: '3 não lidas', active: false },
    { text: 'A-Z', active: false },
    { text: 'Antigas', active: false },
]);

const click = (index) => {

    const filtersAux = [...filters];
    
    const [clickedItem] = filtersAux.splice(index, 1);
    [clickedItem.active] = [!clickedItem.active];

    filtersAux.unshift(clickedItem);

    setFilters(filtersAux);
};



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
                    <input type="text" placeholder='Busque por conversas...' />
                    <div className="img-lupa">
                        <img src={lupa} alt='Lupa pesquisa' />
                    </div>
                </div>
                <div className="boxs-pesquisa">

                    {
                        filters.map((item, index) => (

                            <div onClick={() => click(index)} className={item.active===false ? 'box-pesquisa' : 'box-pesquisa-checked'} key={index}>
                                {item.text}
                            </div>
                        ))
                    }
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
            <div className="barra-final-maior">
                <div className="barra-final">
                    
                </div>
            </div>
        </div>
        <div className="chat">
            <div className="arvore-chat">
                <img src={arvore} alt="" />
            </div>
            <div className="barra-top">
                <div className="img-foto">
                    <img src={mulher} />
                </div>
                <div className="nome-user-chat">
                    <h2>Joana Maria da Silva</h2>
                </div>
                <div className="icons-chat">
                    <div className="icons-chat-p">
                        <img src={cam} alt="" />  
                        <img src={block} alt="" />
                    </div>
                    <img src={close} alt="" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Chat;