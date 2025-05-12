function Chat() {

    const user = {foto: 'Arvore Azul.svg', nome: 'Jana Maria da Silva' }

    return (
    <div className="chat-container">
        <div className="barra-top-chat">
            <div className="img">
                <img src={user.foto} />
            </div>
            <div className="nome">
                <h2>
                    {user.nome}
                </h2>
            </div>
            <div className="buttons">
                <button>
                    A    
                </button>
                <button>
                    B
                </button>
                <button>
                    C
                </button>
            </div>
        </div>
        <div className="conversa"></div>
        <div className="barra-bottom-chat">
            <div className="inpt-message">
                <input type="text" />
            </div>
            <div className="buttons">
                <p>send</p>
            </div>
        </div>
    </div>
  )
}

export default Chat;