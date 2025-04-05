import voltar from '../assets/voltar 2.svg';
import config from '../assets/settings.svg';
import help from '../assets/help 1.svg';
import mulher from '../assets/image 8.png';
import lupa from '../assets/search 1.svg';
import { useState, useEffect, useRef } from 'react';
import close from '../assets/Group 239210.svg';
import cam from '../assets/cam-recorder (1) 1.svg';
import block from '../assets/blocked 1.svg';
import handClick from '../assets/image 17.svg';
import microfone from '../assets/image 15.svg';
import figurinhaIcon from '../assets/image 16.svg';
import arvoreAzul from '../assets/Arvore Azul.svg';
import arvoreBranca from '../assets/Arvore Branca.svg';
import io from "socket.io-client";
import './CSS/Chat.css';

function Chat() {
    const socket = io("http://localhost:3001");

    const [chats, setChats] = useState([
        { nome: 'Vitor Azevedo', foto: mulher },
        { nome: 'Anderson Silva', foto: mulher},
        { nome: 'Lúcia Katia', foto: mulher },
        { nome: 'Vanessa Lopes', foto: mulher },
        { nome: 'Ritinha', foto: mulher },
        { nome: 'Cristiano', foto: mulher },
        { nome: 'Fundação E-Zag', foto: mulher },
        { nome: 'Manassés da Rosa Marcelino', foto: mulher },
        { nome: 'Silvana Barbosa', foto: mulher },
        { nome: 'Cintia Chagas', foto: mulher },
        { nome: 'Carlos Alberto', foto: mulher },
        { nome: 'Andi Ferreira', foto: mulher },
        { nome: 'Finneas', foto: mulher },
        { nome: 'Melissa Carpenter', foto: mulher },
        { nome: 'Melri Ribeiro', foto: mulher },
        { nome: 'Bárbara Soares', foto: mulher },
        { nome: 'Simone Monteiro', foto: mulher },
        { nome: 'Isabella coach', foto: mulher },
        { nome: 'Thiago klovisck', foto: mulher },
    ]);

    const [chatSelected, setChatSelected] = useState();
    const [busca, setBusca] = useState('');
    const [result, setResult] = useState([]);
    const [useResult, setUseResult] = useState(false);
    const [visibleSettings, setVisibleSettings] = useState(false);
    const settingsRef = useRef(null);
    const [theme, setTheme] = useState('light');
    const tema = theme==='light' ? 'escuro' : 'claro';
    const [fontSize, setFontSize] = useState('medium');
    const [filters, setFilters] = useState([
        { text: '3 não lidas', active: false },
        { text: 'A-Z', active: false },
        { text: 'Antigas', active: false },
    ]);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [inptvalue, setInptvalue] = useState('');
    const [name, setName] = useState('');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const toggleFontSize = () => {
        setFontSize((prevSize) => {
            if (prevSize === 'small') return 'medium';
            if (prevSize === 'medium') return 'large';
            return 'small';
        });
    };

    const click = (index) => {
        const filtersAux = [...filters];
        const [clickedItem] = filtersAux.splice(index, 1);
        clickedItem.active = !clickedItem.active;
        filtersAux.unshift(clickedItem);
        setFilters(filtersAux);
        classifica(clickedItem);
    };

    const classifica = (item) => {
        if (item.active) {
            if (item.text === 'A-Z') {
                const sortedChats = [...chats].sort((a, b) => a.nome.localeCompare(b.nome));
                setResult(sortedChats);
                setUseResult(true);
            } else if (item.text === 'Antigas') {
                const oldToNewChats = [...chats].reverse();
                setResult(oldToNewChats);
                setUseResult(true);
            }
        } else {
            if (item.text === 'A-Z' || item.text === 'Antigas') {
                setUseResult(false);
            }
        }
    };

    useEffect(() => {
        const nameAux = prompt('Qual seu nome?');
        setName(nameAux);

        socket.on("receiveMessage", (data) => {
            let newMessage = JSON.parse(data);
            newMessage.sender = newMessage.name === nameAux ? 'me' : 'other';
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        return () => socket.off("receiveMessage");
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    function buscaProfissional(e) {
        const termo = e.target.value;
        setBusca(termo.toLowerCase());

        if (termo === '') {
            setResult([]);
            setUseResult(false);
            return;
        }

        const filtrados = chats.filter(chat => chat.nome.toLowerCase().includes(termo));
        setResult(filtrados || []);
        setUseResult(true);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setVisibleSettings(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inptvalue.trim() === '') return;

        const newMessage = { sender: 'me', text: inptvalue, foto: mulher, name: name };
        setInptvalue('');
        socket.emit("sendMessage", JSON.stringify(newMessage));
    };

    return (
        <div className={`container-chats ${theme} ${fontSize}`}>
            <div className="barra-lateral-chat">
                <div className="barra-cima">
                    <img className='voltar-btn' src={voltar} alt="" />
                    <img onClick={() => setVisibleSettings(!visibleSettings)} src={config} alt="" />
                    {
                        visibleSettings &&
                        <div className="settings" ref={settingsRef}>
                            <div className="config" onClick={toggleFontSize}>Tamanho da fonte</div>
                            <div className="config" onClick={toggleTheme}>Tema {tema}</div>
                        </div>
                    }
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
                        <div className="div-lupa-input">
                            <img src={lupa} alt='Lupa pesquisa' />
                            <input onChange={buscaProfissional} value={busca} type="text" placeholder='Busque por conversas...' />
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
                        (useResult ? result : chats).map((item, index) => (
                            <div key={index} className="chat-barra" onClick={() => setChatSelected(item)}>
                                <img src={item.foto} alt="" />
                                <div className="nome">
                                    <p>{item.nome}</p>
                                </div>
                            </div>
                        ))
                    }

                    {
                        (result.length === 0 && useResult) &&
                        <>
                            <p className='no-results'>Não há resultados para esta busca.</p>
                            <img className='arvore-results' src={arvoreAzul} />
                        </>
                    }
                </div>
                <div className="barra-final-maior">
                    <div className="barra-final"></div>
                </div>
            </div>
            {
                chatSelected ?
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
                    <div style={{height: '83%', overflowY: 'auto'}}>
                        <div className="messages-div">
                            <div className="acess-profile-div">
                                <div className="user-name">@jana.silvaa</div>
                                <div className="btn-acess">
                                    <b>Acessar perfil</b>
                                </div>
                            </div>
                            <div className="arvore-chat">
                                {theme === 'light' ? <img src={arvoreAzul} alt="" /> : <img src={arvoreBranca} alt="" />}
                            </div>
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.sender === 'me' ? 'message-right' : 'message-left'}>
                                    {msg.sender !== 'me' &&
                                        <div className="image-message-right">
                                            <img src={msg.foto} alt="" />
                                        </div>
                                    }
                                    <div className={msg.sender === 'me' ? 'text-message-right' : 'text-message-left'}>
                                        {msg.text}
                                    </div>
                                    {msg.sender === 'me' &&
                                        <div className="image-message-left">
                                            <img src={msg.foto} alt="" />
                                        </div>
                                    }
                                </div>
                            ))}
                            <div ref={messagesEndRef}></div>
                        </div>
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
                <div className="no-chat-selected">
                    <h2>Selecione uma conversa</h2>
                    <p>Escolha um chat para visualizar as mensagens aqui.</p>
                </div>
            }
        </div>
    );
}

export default Chat;
