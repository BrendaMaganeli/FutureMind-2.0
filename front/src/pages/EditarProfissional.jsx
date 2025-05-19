import mulher from "../assets/image 8.png";
import icon_um from "../assets/agenda 2.svg";
import icon_dois from "../assets/cam-recorder (1) 11.svg";
import icon_tres from "../assets/icons8-bate-papo-48 2.svg";
import Arvore from "../assets/Group 239274.svg";
import "./CSS/EditarProfissional.css";
import voltar from "../assets/seta-principal.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";

function EditarProfissional() {

  const navigate = useNavigate();
  const profissional = JSON.parse(localStorage.getItem('User-Profile'));
  const [showModal, setShowModal] = useState(false);
  const [valorConsulta, setValorConsulta] = useState(`R$ ${0.00}`);

  const opcoesEspecializacao = [
    { value: "psicologia-clinica", label: "Psicologia Clínica" },
    { value: "psicopedagogia", label: "Psicopedagogia" },
    { value: "neuropsicologia", label: "Neuropsicologia" },
  ];

  const opcoesAbordagens = [
    { value: "cognitivo-comportamental", label: "Cognitivo-Comportamental" },
    { value: "psicanalise", label: "Psicanálise" },
    { value: "humanista", label: "Humanista" },
  ];

  const [especializacoes, setEspecializacoes] = useState([]);
  const [abordagens, setAbordagens] = useState([]);
  const [especializacaoValida, setEspecializacaoValida] = useState(true);
  const [abordagemValida, setAbordagemValida] = useState(true);

  const deletarProfissional = async() => {

    try {
      
      const response = await fetch('http://localhost:4242/editarprofissional',{

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

  function formatarDataBrasileira(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataParaEnvio(dataBR) {
    if (!dataBR.includes('/')) {
      // Caso seja um ISO ou Date válido
      const data = new Date(dataBR);
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    }
  
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  function transformarParaOpcoesSelecionadas(valoresSalvos, opcoesDisponiveis) {
    try {
      const valoresArray = typeof valoresSalvos === 'string'
        ? JSON.parse(valoresSalvos)
        : valoresSalvos;
  
      if (!Array.isArray(valoresArray)) return [];
  
      return opcoesDisponiveis.filter(opcao =>
        valoresArray.some(valor => valor === opcao.value || valor.value === opcao.value)
      );
    } catch {
      return [];
    }
  }
  
  

  const [profissionais, setProfissionais] = useState({
    id_profissional: profissional.id_profissional,
    nome: profissional.nome,
    cpf: profissional.cpf,
    telefone: profissional.telefone,
    email: profissional.email,
    data_nascimento: formatarDataBrasileira(profissional.data_nascimento),
    senha: profissional.senha,
    crp: profissional.crp,
    abordagem: profissional.abordagem,
    foto: profissional.foto,
    especializacao: profissional.especializacao,
    email_profissional: profissional.email_profissional,
    sobre_mim: profissional.sobre_mim,
  });

  const salvarEdicao = async () => {
    try {
      const profissionalParaEnviar = {
        ...profissionais,
        data_nascimento: formatarDataParaEnvio(profissionais.data_nascimento),
        abordagem: JSON.stringify(abordagens), // serializa para string JSON
        especializacao: JSON.stringify(especializacoes),
        valor_consulta: formatarValorConsultab(valorConsulta)
      };
  
      const response = await fetch(`http://localhost:4242/editarprofissional`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profissionalParaEnviar),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('User-Profile', JSON.stringify(data));
        window.location.reload(); 
      } else {
        console.error('Erro ao salvar:', data);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  };
  

  // Máscaras para CPF, Telefone e Data
  function aplicarMascaraCPF(valor) {
    return valor
      .replace(/\D/g, '') 
      .slice(0, 11)  
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function aplicarMascaraTelefone(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1'); 
  }

  function aplicarMascaraData(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  }

  const formatarValorConsulta = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    return `R$ ${numero.replace(".", ",")}`;
  };

  const formatarValorConsultab = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    const numero = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    return numero
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
              <Link to="/chats">
              <img src={voltar} alt="" className="voltar-seta"/>
              </Link>
            </div>
            <div className="botoes-superiores-p">
          <button onClick={handleDeletarClick} className="botao-deletar">Deletar</button>
          <button onClick={sairProfissional} className="botao-sair">Sair</button>
            </div>
          </div>

        <div className="editar-profissional">
        <div className="floating-input-pac">
              <input 
                type="text" 
                placeholder=" " 
                value={profissionais.nome}
                required 
                onChange={(e) => setProfissionais({ ...profissionais, nome: e.target.value })}
              />
              <label>Nome Completo</label>
            </div>
            <div className="floating-input-pac">
              <input 
                type="text" 
                placeholder=" " 
                value={profissionais.cpf}
                required 
                onChange={(e) => setProfissionais({ ...profissionais, cpf: aplicarMascaraCPF(e.target.value) })}
              />
              <label>CPF</label>
            </div>
            <div className="floating-input-pac">
              <input 
                type="text" 
                placeholder=" " 
                value={profissionais.telefone}
                required 
                onChange={(e) => setProfissionais({...profissionais, telefone: aplicarMascaraTelefone(e.target.value)})}
              />
              <label>Telefone</label>
            </div>
          <div className="floating-input-pac">
              <input 
                type="text" 
                placeholder=" " 
                value={profissionais.email}
                required 
                onChange={(e) => setProfissionais ({...profissionais, email: e.target.value})}
              />
              <label>E-mail</label>
            </div>
          <div className="floating-input-pac">
              <input 
                type="text" 
                placeholder=" " 
                value={profissionais.data_nascimento}
                required 
                onChange={(e) => setProfissionais ({...profissionais, data_nascimento: aplicarMascaraData(e.target.value) })}
              />
              <label>Data de Nascimento</label>
            </div>
            <div className="floating-input-pac">
              <input 
                type="password" 
                placeholder=" " 
                value={profissionais.senha}
                required 
                onChange={(e) => setProfissionais ({...profissionais, senha: e.target.value})}
              />
              <label>Senha</label>
            </div>
          <div className="floating-input-pac">
            <input 
            type="text" 
            placeholder=" " 
            value={profissionais.crp} 
            required 
            onChange={(e) => setProfissionais ({...profissionais, crp: e.target.value})}
            />
            <label>CRP</label>
          </div>
          <div className="floating-input-pac">
            <input 
            type="text" 
            placeholder=" " 
            value={valorConsulta}
            required 
            onChange={(e) => {
              setValorConsulta(formatarValorConsulta(e.target.value));
            }}
            />
            <label>Preço</label>
          </div>
                <div className="select-filtro-prof">
                <Select
                placeholder="Especializações"
                isMulti
                value={transformarParaOpcoesSelecionadas(profissionais.especializacao, opcoesEspecializacao)}
                onChange={(selectedOptions) =>
                  setProfissionais((prevState) => ({
                    ...prevState,
                    especializacao: selectedOptions.map((opcao) => opcao.value)
                  }))
                }
                options={opcoesEspecializacao}
                className="custom-select-prof"
                required
                
              />

              <Select
                placeholder="Abordagem"
                isMulti
                value={transformarParaOpcoesSelecionadas(profissionais.abordagem, opcoesAbordagens)}
                onChange={(selectedOptions) =>
                  setProfissionais((prevState) => ({
                    ...prevState,
                    abordagem: selectedOptions.map((opcao) => opcao.value)
                  }))
                }
                options={opcoesAbordagens}
                className="custom-select-prof"
                required
              />

                </div>
          <div className="floating-input-pac">
              <input 
                type="text" 
                placeholder=" " 
                value={profissionais.email_profissional}
                required 
                onChange={(e) => setProfissionais ({...profissionais, valor_consulta: e.target.value})}
              />
              <label>E-mail</label>
            </div>
        </div>
        <div className="BTN-SALVAR">
          <button className="salvar-btn" onClick={salvarEdicao}>Salvar</button>
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
