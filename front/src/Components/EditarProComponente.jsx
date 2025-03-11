import logo from '../assets/Logo_SA_2FASE.png';
import voltar from '../assets/voltar 2.svg';

function EditarProComponente() {
  return (
    <div style={{position: 'relative'}}>
        <div className="editar-profissional">

        <div className="arvore-profissional">
        <img src="Arvore Perfil.png" alt="" />
    </div>

    <div className="botoes-maior">
      <div className="botoes">
        <img src={voltar} alt="" />
      </div>
    </div>
    <div className="loguinho">
      <img src={logo} alt="" />
    </div>
        <div className="inpt-div">
          <label htmlFor="">
          Nome completo
        </label>
        <input type="text" placeholder="Nome completo" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Cpf
        </label>
        <input type="text" placeholder="Cpf" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Telefone
        </label>
        <input type="text" placeholder="Telefone" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Preferências
        </label>
        <input type="text" placeholder="Preferências" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          E-mail
        </label>
        <input type="email" placeholder="E-mail" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Crp
        </label>
        <input type="text" placeholder="Crp" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Data de nascimento
        </label>
        <input type="date" placeholder="Data de nascimento" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Especialização
        </label>
        <input type="text" placeholder="Especialização" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Preço
        </label>
        <input type="text" placeholder="Preço" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Abordagem
        </label>
        <input type="text" placeholder="Abordagem" />
        </div>
        <div className="inpt-div">
          <label htmlFor="">
          Senha
        </label>
        <input type="password" placeholder="Senha" />
        </div>
    </div>
    <div className="BTN-SALVAR">
        <button className="salvar-btn">Salvar</button>
    </div>
    </div>
  )
}

export default EditarProComponente