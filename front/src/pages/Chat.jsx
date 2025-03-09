import voltar from '../assets/voltar 2.svg';
import config from '../assets/settings.svg';
import help from '../assets/help 1.svg';
import mulher from '../assets/image 8.png';
import lupa from '../assets/search 1.svg';
import { useState } from 'react';
import close from '../assets/Group 239210.svg';
import cam from '../assets/cam-recorder (1) 1.svg';
import block from '../assets/blocked 1.svg';
import handClick from '../assets/image 17.svg';
import microfone from '../assets/image 15.svg';
import figurinhaIcon from '../assets/image 16.svg';
import './CSS/Chat.css';

function Chat() {

    const chats = [
        { nome: 'Vitor Azevedo', foto: mulher },
        ...Array(35).fill({ nome: 'Lúcia Katia', foto: mulher })
    ];

    const [chatSelected, setChatSelected] = useState();
    const [busca, setBusca] = useState();
    const [result, setResult] = useState([]);
    const [useResult, setUseResult] = useState([]);

    const [filters, setFilters] = useState([
        { text: '3 não lidas', active: false },
        { text: 'A-Z', active: false },
        { text: 'Antigas', active: false },
    ]);

    const [messages, setMessages] = useState([
        { sender: 'other', text: 'Bom dia! Tem disponibilidade amanhã (terça) às 14 ou 15hrs?', foto: mulher }
    ]);

    const [inptvalue, setInptvalue] = useState('');

    const click = (index) => {
        const filtersAux = [...filters];
        const [clickedItem] = filtersAux.splice(index, 1);
        clickedItem.active = !clickedItem.active;
        filtersAux.unshift(clickedItem);
        setFilters(filtersAux);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (inptvalue.trim() === '') return;

        const newMessage = { sender: 'me', text: inptvalue, foto: mulher };
        setMessages([...messages, newMessage]);
        setInptvalue('');

        setTimeout(() => {
            const autoResponse = { sender: 'other', text: 'Ok, estarei disponível às 14h!', foto: mulher };
            setMessages((prevMessages) => [...prevMessages, autoResponse]);
        }, 2000);
    };

    function buscaProfissional(e) {

        setBusca(e.target.value);

        let resultAux = result;

        chats.forEach(item => {
            
            if (item.nome==busca) {

                resultAux.push(item);
            }
        });

        setResult(resultAux);

        if (result.length==0) {

            setUseResult(false);
        } else {

            setUseResult(true);
        }
    }

    return (
        <div className="container-chats">
            <div className="barra-lateral-chat">
                <div className="barra-cima">
                    <img className='voltar-btn' src={voltar} alt="" />
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
                        <input onChange={(e) => buscaProfissional(e)} value={busca} type="text" placeholder='Busque por conversas...' />
                        <div className="img-lupa">
                            <img src={lupa} alt='Lupa pesquisa' />
                        </div>
                    </div>
                    <div className="boxs-pesquisa">
                        {filters.map((item, index) => (
                            <div onClick={() => click(index)} className={item.active ? 'box-pesquisa-checked' : 'box-pesquisa'} key={index}>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="conversas">
                    {
                        result 
                        ?
                        (
                        chats.map((item, index) => (
                        <div key={index} className="chat-barra" onClick={() => setChatSelected(item)}>
                            <img src={item.foto} alt="" />
                            <div className="nome">
                                <p>{item.nome}</p>
                            </div>
                        </div>
                        )
                    )
                )
                        :
                        (

                            result.map((item, index) => (
                                <div key={index} className="chat-barra" onClick={() => setChatSelected(item)}>
                            <img src={item.foto} alt="" />
                            <div className="nome">
                                <p>{item.nome}</p>
                            </div>
                        </div>
                        )
                    ))}
                </div>
                <div className="barra-final-maior">
                    <div className="barra-final"></div>
                </div>
            </div>
            {
                chatSelected
                ?
                <div className="chat">
                    <div className="barra-top">
                        <div className="img-foto">
                            <img src={chatSelected.foto} alt="" />
                        </div>
                        <div className="nome-user-chat">
                            <h5>{chatSelected.nome}</h5>
                        </div>
                        <div className="icons-chat">
                            <div className="icons-chat-p">
                                <img src={cam} className='icon-chat-p-1' alt="" />  
                                <img src={block} className='icon-chat-p-2' alt="" />
                            </div>
                            <img onClick={() => setChatSelected('')} src={close} className='icon-chat-p-3' alt="" />
                        </div>
                    </div>
                    <div className="acess-profile-div">
                        <div className="user-name">@jana.silvaa</div>
                        <div className="btn-acess">
                            <b>Acessar perfil</b>
                        </div>
                    </div>
                    <div className="messages-div">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender === 'me' ? 'message-right' : 'message-left'}>

                                {
                                    msg.sender !== 'me'
                                    &&
                                    <div className="image-message-right">
                                        <img src={msg.foto} alt="" />
                                    </div>
                                }
                                
                                <div className={msg.sender === 'me' ? 'text-message-right' : 'text-message-left'}>
                                    {msg.text}
                                </div>

                                {

                                    msg.sender === 'me'
                                    &&
                                    <div className="image-message-left">
                                        <img src={msg.foto} alt="" />
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} className="barra-bottom">
                        <div className="inpt-chat">
                            <input type="text" placeholder='Enter a message...' value={inptvalue} onChange={(e) => setInptvalue(e.target.value)} />
                        </div>
                        <div className="icons-chat-inpt">
                            <div className="icons-inpt-a">
                                <img src={figurinhaIcon} alt="" />
                                <img src={microfone} alt="" />
                            </div>
                            <button type='submit'>
                                <img src={handClick} className='hand-click' alt="" />
                            </button>
                        </div>
                    </form>
                </div>
                :
                <div>Inicie uma conversa agora</div>
            }
        </div>
    );
};

export default Chat;
