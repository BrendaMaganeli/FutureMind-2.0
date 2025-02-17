import React from "react";
import "./CSS/VisualizarProfissional.css";

function VisualizarProfissional() {
  return (
    <div className="container">
      

      {/* <div className="acoes-perfil">
        <div className="item-acao">📅 Agende sua consulta</div>
        <div className="item-acao">📹 Video chamada</div>
        <div className="item-acao">💬 Chat</div>
        <div className="item-acao">💳 Pagamentos</div>
      </div> */}
    <aside className="barra-lateral">
      <h2 className="titulo">tela de perfil</h2>
      <div className="cabecalho-perfil">
        <img
          src="https://via.placeholder.com/100"
          alt="Foto do perfil"
          className="imagem-perfil"
        />
        <h2 className="nome-perfil">Nome do perfil</h2>
        <p className="especializacao-perfil">Especialização</p>
        <p className="descricao-perfil">Breve descrição.</p>
      </div>

      <div className="experiencia-perfil">
        <h3>Experiência</h3>
        <div className="cartao-experiencia">
          <strong>Cargo</strong> <span className="ano">Ano</span>
          <p>Breve descrição.</p>
        </div>
        <div className="cartao-experiencia">
          <strong>Cargo</strong> <span className="ano">Ano</span>
          <p>Breve descrição.</p>
        </div>
        <button className="botao-baixar">Baixar currículo</button>
      </div>
      <div className="caixa-comandos">
        <div className="cartao-informacao">
            <h2 className="cabecalho-informacao">Funções</h2>
        </div>
        <div className="funcionalidades">
         <div className="topicos">
            {/* <img src="" alt="" /> */}
            <p>Agende sua cosulta</p>
         </div>
         <div className="topicos">
            {/* <img src="" alt="" /> */}
            <p>Vídeo Chamada</p>
         </div>
         <div className="topicos">
            {/* <img src="" alt="" /> */}
            <p>Chat</p>
         </div>
         <div className="topicos">
            {/* <img src="" alt="" /> */}
            <p>Pagamento</p>
         </div>
        </div>
      </div>
    </aside>
  
    <main className="conteudo">
        <div className="arvore">
            <img src="Arvore Perfil.png" alt="" />
        </div>
        <div className="caixa-info-geral">

      <div className="caixa-informacoes">
        <div className="cartao-informacao-e">
          <div className="cabecalho-informacao">Especialização</div>
          <div className="corpo-informacao"></div>
        </div>
        <div className="cartao-informacao-a">
          <div className="cabecalho-informacao">Abordagem</div>
          <div className="corpo-informacao"></div>
        </div>
      </div>
  
        <div className="cabecalho-sobre-mim">Sobre mim</div>
        <div className="corpo-sobre-mim"></div>
        </div>
    </main>
  
  </div>
  
  );
}

export default VisualizarProfissional;