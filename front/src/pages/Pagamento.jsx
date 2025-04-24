import  { useState } from "react";
import './CSS/Pagamento.css';
import Seta from '../assets/caret-down-solid.svg';
import mulher from '../assets/image 8.png';

export default function PagamentoConsulta() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [metodoSelecionado, setMetodoSelecionado] = useState("cartao");

  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  const [erroNumero, setErroNumero] = useState(false);
  const [erroNome, setErroNome] = useState(false);
  const [erroValidade, setErroValidade] = useState(false);
  const [erroCvv, setErroCvv] = useState(false);

  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const valorOriginal = 165;

  const [mostrarAgenda, setMostrarAgenda] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("2025-04-12");
  const [horaSelecionada, setHoraSelecionada] = useState("14:00");

  const [mostrarModalRemover, setMostrarModalRemover] = useState(false);

  const [nomeDependente, setNomeDependente] = useState("");
  const [nascimentoDependente, setNascimentoDependente] = useState("");
  const [generoDependente, setGeneroDependente] = useState("");

  const [dependentes, setDependentes] = useState([
    { value: "evelyn", label: "Evelyn Lohanny Santos Da Silva" }
  ]);

  const formatarNumeroCartao = (valor) => {
    return valor.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  };
  
  const formatarValidade = (valor) => {
    return valor.replace(/\D/g, "").replace(/^(\d{2})(\d{0,2})/, "$1/$2").slice(0, 5);
  };
  
  const formatarCVV = (valor) => {
    return valor.replace(/\D/g, "").slice(0, 3);
  };
  

  const aplicarCupom = () => {
    if (cupom.trim().toLowerCase() === "desconto10") {
      setDesconto(valorOriginal * 0.10);
    } else {
      setDesconto(0);
    }
  };

  const handleFinalizar = () => {
    const numeroValido = numeroCartao.replace(/\s/g, "").length === 16;
    const nomeValido = nomeCartao.trim().length > 0;
    const validadeValida = /^\d{2}\/\d{2}$/.test(validadeCartao);
    const cvvValido = cvvCartao.length === 3;
  
    setErroNumero(!numeroValido);
    setErroNome(!nomeValido);
    setErroValidade(!validadeValida);
    setErroCvv(!cvvValido);
  
    if (!numeroValido || !nomeValido || !validadeValida || !cvvValido) return;
  
    alert("Agendamento finalizado com sucesso!");
  };
  

  const handleAlterarAgendamento = () => {
    setMostrarAgenda(true);
  };

  const handleCadastrarDependente = () => {
    if (nomeDependente && nascimentoDependente && generoDependente) {
      const novoId = `dep-${Date.now()}`;
      const novoDependente = {
        value: novoId,
        label: nomeDependente
      };
      setDependentes((prev) => [...prev, novoDependente]);
      setPacienteSelecionado(novoId);
      setMostrarModal(false);
      setNomeDependente("");
      setNascimentoDependente("");
      setGeneroDependente("");
    } else {
      alert("Preencha todos os campos do dependente.");
    }
  };

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>Finalize seu agendamento</h2>

        <p style={{ fontWeight: "500", marginBottom: "8px" }}>Forma de pagamento</p>
        <div className="tabs-container">
          <div className="slider" style={{ left: `${['cartao', 'boleto', 'pix'].indexOf(metodoSelecionado) * 33.333}%` }} />
          {[{ value: "cartao", label: "Cartão de crédito" }, { value: "boleto", label: "Boleto bancário" }, { value: "pix", label: "Pix" }].map((metodo) => (
            <button
              key={metodo.value}
              onClick={() => setMetodoSelecionado(metodo.value)}
              className={`tab ${metodoSelecionado === metodo.value ? 'active' : ''}`}
            >
              {metodo.label}
            </button>
          ))}
        </div>

        {metodoSelecionado === "cartao" && (
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "7px" }}>
            <h3 style={{ fontWeight: "500" }}>Informações do Pagamento</h3>
            <div className="floating-select-2">
              <select
                required
                value={generoDependente}
                onChange={(e) => setGeneroDependente(e.target.value)}
              >
                <option value="" disabled hidden>Selecione</option>
                <option value="masculino">C6 bank</option>
                <option value="feminino">Inter</option>
                <option value="outro">Nubank</option>
                <option value="outro">Itaú</option>
                <option value="outro">Bradesco</option>
              </select>
              <label>Banco</label>
            </div>
            <p className={`error-text ${erroValidade ? 'show' : ''}`}>
                Validade é obrigatória.
              </p>
            <div className="floating-input">
              <input type="text" placeholder=" " value={numeroCartao}  onChange={(e) => {setNumeroCartao(formatarNumeroCartao(e.target.value));setErroNumero(false);}} required />
              <label>Número do Cartão</label>
            </div>
            <p className={`error-text ${erroValidade ? 'show' : ''}`}>
                Validade é obrigatória.
              </p>
            <div className="floating-input">
              <input type="text" placeholder=" " value={nomeCartao}  onChange={(e) => {setNomeCartao(e.target.value);setErroNome(false);}} required />
              <label>Nome como aparece no cartão</label>
            </div>
            <p className={`error-text ${erroValidade ? 'show' : ''}`}>
              Validade é obrigatória.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <div style={{ flex: 1 }}>
              <div className="floating-input-2">
                <input type="text" placeholder=" " value={validadeCartao}onChange={(e) => {setValidadeCartao(formatarValidade(e.target.value));setErroValidade(false);}} required />
                <label>Validade</label>
              </div>
              <p className={`error-text ${erroValidade ? 'show' : ''}`}>
            Validade é obrigatória.
            </p>
              </div>
              <div style={{ flex: 1 }}>
            <div className="floating-input-2">
              <input type="text" placeholder=" " value={cvvCartao}   onChange={(e) => {setCvvCartao(formatarCVV(e.target.value));setErroCvv(false);}} required />
              <label>CVV</label>
            </div>
            <p className={`error-text ${erroValidade ? 'show' : ''}`}>
          Validade é obrigatória.
        </p>
          </div>
          </div>
          </div>
        )}


        {(metodoSelecionado === "boleto" || metodoSelecionado === "pix") && (
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <h3 style={{ fontWeight: "500" }}>Informações do Pagamento</h3>
            <div className="floating-input"><input type="text" placeholder=" " required /><label>CPF</label></div>
            <div className="floating-input"><input type="text" placeholder=" " required /><label>Endereço</label></div>
            <div className="floating-input"><input type="text" placeholder=" " required  /><label>Nome Completo</label></div>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <div className="floating-input-2"><input type="text" placeholder=" " required /><label>Estado</label></div>
              <div className="floating-input-2"><input type="text" placeholder=" " required /><label>Cidade</label></div>
            </div>
          </div>
        )}

        <p style={{ fontWeight: "500" }}>Tem um cupom de desconto?</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", width: "100%", alignItems: "center" }}>
          <div className="cupom">
            <input type="text" placeholder=" " value={cupom} onChange={(e) => setCupom(e.target.value)} required />
            <label>Inserir código de desconto</label>
          </div>
          <button
            onClick={aplicarCupom}
            style={{
              backgroundColor: "#013a63",
              color: "white",
              padding: "8px 13px",
              border: "none",
              borderRadius: "6px",
              width: "20%",
              height: "45px",
              marginTop: "2.6%",
              cursor: "pointer"
            }}
          >
            Aplicar
          </button>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
          <p style={{ fontWeight: "600" }}>Quem será atendido?</p>
          <label style={{ fontSize: "14px" }}>Paciente</label>
          <select
            value={pacienteSelecionado}
            onChange={(e) => {
              const value = e.target.value;
              setPacienteSelecionado(value);
              if (value === "novo") setMostrarModal(true);
            }}
            style={{
              width: "100%",
              height: "45px",
              padding: "8px",
              marginTop: "8px",
              backgroundColor: "rgba(247, 249, 251)",
              border: "0.5px solid rgba(231, 234, 244)",
              borderRadius: "4px",
              cursor: "pointer",
              paddingRight: "36px",
              backgroundPosition: "right 10px center",
              backgroundRepeat: "no-repeat",
              appearance: "none",
              backgroundImage: `url(${Seta})`
            }}
          >
            {dependentes.map((dep) => (
              <option key={dep.value} value={dep.value}>
                {dep.label}
              </option>
            ))}
            <option value="novo">Cadastrar novo dependente</option>
          </select>
        </div>
        <button onClick={handleFinalizar} style={{ width: "100%", marginTop: "24px", backgroundColor: "#013a63", color: "white", padding: "15px", border: "none", borderRadius: "6px", fontWeight: "600" }}>
          Finalizar agendamento
        </button>
      </div>

      <div>
        <div style={{ border: "1px solid #ddd", padding: "30px", borderRadius: "8px", width: "110%" }}>
          <p style={{ fontWeight: "700", marginTop: "5%", fontSize: "20px" }}>Resumo</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", marginTop: "5%" }}>
            <span>Consultas</span>
            <span>R${valorOriginal.toFixed(2)}</span>
          </div>
          {desconto > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "green" }}>Desconto aplicado</span>
              <span style={{ color: "green" }}>-R${desconto.toFixed(2)}</span>
            </div>
          )}
          <div style={{ borderTop: "1.5px solid #ddd", margin: "8px 0" }}></div>
          <div style={{ fontWeight: "500", textAlign: "right", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <p style={{ fontSize: "14px", marginRight: "4%" }}>Valor a ser pago </p>
            <span style={{ fontSize: "22px" }}>R${(valorOriginal - desconto).toFixed(2)}</span>
          </div>

          <div style={{ marginTop: "24px" }}>
            <p style={{ fontWeight: "500", marginTop: "16px", fontSize: "20px" }}>Agendamentos</p>
            <div style={{ display: "flex", alignItems: "center", gap: "25px", marginTop: "12px" }}>
              <img src={mulher} alt="Foto profissional" style={{ borderRadius: "9999px", width: "60px", height: "60px" }} />
              <div>
                <p style={{ fontWeight: "500", fontSize: "16px" }}>Jeciana Botelho</p>
                <p style={{ fontSize: "16px", color: "#888" }}>CRP 03/10307</p>
                <p style={{ fontSize: "16px" }}>Atendimento Online</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10%", borderTop: "1.5px solid #ddd" }}>
              <div style={{ fontSize: "15px", display: "flex", marginTop: "5%", gap: "16px" }}>
                <p><strong>Data</strong> {dataSelecionada.split("-").reverse().join("/")}</p>
                <p><strong>Horário</strong> {horaSelecionada}</p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "5%" }}>
                <button onClick={handleAlterarAgendamento} style={{ backgroundColor: "#013a63", color: "white", padding: "12px 20px", border: "none", borderRadius: "4px", fontSize: "16px" }}>Alterar</button>
                <button onClick={() => setMostrarModalRemover(true)} style={{ padding: "8px 16px", border: "2px solid #ddd", borderRadius: "4px", backgroundColor: "transparent" }}>Remover</button>
              </div>
            </div>
          </div>

          {mostrarAgenda && (
            <div style={{ marginTop: "16px" }}>
              <div className="floating-input-4">
                <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} required />
                <label>Nova data</label>
              </div>
              <div className="floating-input-4" style={{ marginTop: "8px" }}>
                <input type="time" value={horaSelecionada} onChange={(e) => setHoraSelecionada(e.target.value)} required />
                <label>Novo horário</label>
              </div>
              <button onClick={() => setMostrarAgenda(false)} style={{ width: "100%", marginTop: "16px", backgroundColor: "#013a63", color: "white", padding: "12px", border: "none", borderRadius: "4px", fontWeight: "600" }}>
                Confirmar alteração
              </button>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", width: "30%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Cadastre um novo dependente!</h3>
              <button onClick={() => setMostrarModal(false)} style={{ border: "none", background: "none", fontSize: "20px" }}>×</button>
            </div>
            <div className="floating-input-3">
              <input
                type="text"
                placeholder=" "
                required
                value={nomeDependente}
                onChange={(e) => setNomeDependente(e.target.value)}
              />
              <label>Nome Completo</label>
            </div>
            <div className="floating-input-3">
              <input
                type="date"
                placeholder=" "
                required
                value={nascimentoDependente}
                onChange={(e) => setNascimentoDependente(e.target.value)}
              />
              <label>Data de Nascimento</label>
            </div>
            <div className="floating-select">
              <select
                required
                value={generoDependente}
                onChange={(e) => setGeneroDependente(e.target.value)}
              >
                <option value="" disabled hidden>Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
              <label>Gênero</label>
            </div>
            <button
              onClick={handleCadastrarDependente}
              style={{ width: "100%", marginTop: "16px", backgroundColor: "#013a63", color: "white", padding: "15px", border: "none", borderRadius: "4px", fontWeight: "600", fontSize: "1em" }}
            >
              Cadastrar
            </button>
          </div>
        </div>
      )}


      {mostrarModalRemover && (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", width: "90%", maxWidth: "400px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Tem certeza que deseja remover este agendamento?</h3>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#013a63",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "600"
          }}
        >
          Sim
        </button>
        <button
          onClick={() => setMostrarModalRemover(false)}
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "white",
            fontWeight: "600"
          }}
        >
          Não
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
