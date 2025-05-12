import mulher from "../assets/image 8.png";
import icon_um from "../assets/agenda 2.svg";
import icon_dois from "../assets/cam-recorder (1) 11.svg";
import icon_tres from "../assets/icons8-bate-papo-48 2.svg";
import Arvore from "../assets/Group 239274.svg";
import "./CSS/EditarProfissional.css";
import voltar from "../assets/seta-principal.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function EditarProfissional() {

  const navigate = useNavigate();
  const profissional = JSON.parse(localStorage.getItem('User-Profile'));
  const [showModal, setShowModal] = useState(false);

  const deletarProfissional = async() => {

    try {
      
      const response = await fetch('http://localhost:4242/editar-profissional',{

        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profissional)
      });

      if (response.ok) {

        localStorage.setItem('User Logado', false);
        localStorage.removeItem('User-Profile');
        navigate('/');
      }
    } catch (err) {
      
      console.log('Falha na conexão: ', err);
    }
  };

  const sairProfissional = () => {

    localStorage.setItem('User Logado', false);
    localStorage.removeItem('User-Profile');
    navigate('/');
  }

  const handleDeletarClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmarDeletar = () => {
    deletarProfissional();
    setShowModal(false);
  };

  return (
    <div className="container">
      <aside className="barra-lateral">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            height: "fit-content",
            alignItems: "center",
          }}
        >
          <div className="cabecalho-perfil">
            <img src={mulher} alt="Foto do perfil" className="imagem-perfil" />
            <h2 className="nome-perfil">{profissional.nome}</h2>
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
        </div>
        <div className="caixa-comandos-p">
          <div className="cartao-informacao">
            <div className="cabecalho-informacao">
              <h2>Funções</h2>
            </div>
          </div>

          <div className="funcionalidades-p">
            <div className="topicos">
              <img src={icon_um} alt="" />
              <p>Agende sua cosulta</p>
            </div>

            <div className="topicos">
              <img src={icon_dois} alt="" />
              <p>Vídeo Chamada</p>
            </div>

            <div className="topicos">
              <img src={icon_tres} alt="" />
              <p>Chat</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="editar-profissional-maior">
        <div className="arvore-profissional">
          <img src={Arvore} alt="" />
        </div>

          <div className="botoes-maior-pro">
            <div className="botoes-pro">
              <img src={voltar} alt="" className="voltar-seta"/>
            </div>
            <div className="botoes-superiores-p">
          <button onClick={handleDeletarClick} className="botao-deletar">Deletar</button>
          <button onClick={sairProfissional} className="botao-sair">Sair</button>
            </div>
          </div>

        <div className="editar-profissional">
          <div className="floating-input-pac">
            <input value={profissional.nome} type="text" placeholder=" " required />
            <label>Nome Completo</label>
          </div>
          <div className="floating-input-pac">
            <input value={profissional.cpf} type="text" placeholder=" " required />
            <label>CPF</label>
          </div>
          <div className="floating-input-pac">
            <input value={profissional.telefone} type="text" placeholder=" " required />
            <label>Telefone</label>
          </div>
          <div className="floating-input-pac">
            <input value={profissional.email} type="text" placeholder=" " required />
            <label>E-mail</label>
          </div>
          <div className="floating-input-pac">
            <input value={profissional.data_nascimento} type="text" placeholder=" " required />
            <label>Data de Nascimento</label>
          </div>
          <div className="floating-input-pac">
            <input value={profissional.senha} type="text" placeholder=" " required />
            <label>Senha</label>
          </div>
          <div className="floating-input-pac">
            <input type="text" placeholder=" " required />
            <label>Preferências</label>
          </div>
          <div className="floating-input-pac">
            <input type="text" placeholder=" " required />
            <label>Especialização</label>
          </div>
          <div className="floating-input-pac">
            <input value={profissional.crp} type="text" placeholder=" " required />
            <label>CRP</label>
          </div>
          <div className="floating-input-pac">
            <input type="text" placeholder=" " required />
            <label>Preço</label>
          </div>
          <div className="floating-input-pac">
            <input type="text" placeholder=" " required />
            <label>Abordagem</label>
          </div>
        </div>
        <div className="BTN-SALVAR">
          <button className="salvar-btn">Salvar</button>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Tem certeza de que deseja deletar sua conta?</h3>
            <div className="buttons">
              <button onClick={handleConfirmarDeletar} className="modal-btn-1">Sim</button>
              <button onClick={handleCloseModal} className="modal-btn-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarProfissional;
