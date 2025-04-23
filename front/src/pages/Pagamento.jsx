import React, { useState } from "react";
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

  const aplicarCupom = () => {
    if (cupom.trim().toLowerCase() === "desconto10") {
      setDesconto(valorOriginal * 0.10);
    } else {
      setDesconto(0);
    }
  };

  const handleFinalizar = () => {
    if (metodoSelecionado === "cartao") {
      setErroNumero(!numeroCartao);
      setErroNome(!nomeCartao);
      setErroValidade(!validadeCartao);
      setErroCvv(!cvvCartao);

      if (!numeroCartao || !nomeCartao || !validadeCartao || !cvvCartao) {
        return;
      }
    }
    alert("Agendamento finalizado com sucesso!");
  };

  const handleRemoverAgendamento = () => {
    const confirmacao = window.confirm("Tem certeza que deseja remover este agendamento?");
    if (confirmacao) {
      alert("Agendamento removido.");
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
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <h3 style={{ fontWeight: "500" }}>Adicionar novo cartão</h3>
            <div className="floating-input">
              <input type="text" placeholder=" " required />
              <label>Banco</label>
            </div>
            <div className="floating-input">
              <input type="text" placeholder=" " required />
              <label>Número do Cartão</label>
            </div>
            <div className="floating-input">
              <input type="text" placeholder=" " required />
              <label>Nome como aparece no cartão</label>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <div className="floating-input-2">
                <input type="text" placeholder=" " required />
                <label>Validade</label>
              </div>
              <div className="floating-input-2">
                <input type="text" placeholder=" " required />
                <label>CVV</label>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            </div>
          </div>
        )}

        {metodoSelecionado === "boleto" && (
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
          <h3 style={{ fontWeight: "500" }}>Adicionar novo cartão</h3>
          <div className="floating-input">
            <input type="text" placeholder=" " required />
            <label>CPF</label>
          </div>
          <div className="floating-input">
            <input type="text" placeholder=" " required />
            <label>Endereço</label>
          </div>
          <div className="floating-input">
            <input type="text" placeholder=" " required />
            <label>Nome Completo</label>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <div className="floating-input-2">
              <input type="text" placeholder=" " required />
              <label>Estado</label>
            </div>
            <div className="floating-input-2">
              <input type="text" placeholder=" " required />
              <label>Cidade</label>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          </div>
        </div>
        )}

        {metodoSelecionado === "pix" && (
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
          <h3 style={{ fontWeight: "500" }}>Adicionar novo cartão</h3>
          <div className="floating-input">
            <input type="text" placeholder=" " required />
            <label>CPF</label>
          </div>
          <div className="floating-input">
            <input type="text" placeholder=" " required />
            <label>Endereço</label>
          </div>
          <div className="floating-input">
            <input type="text" placeholder=" " required />
            <label>Nome Completo</label>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <div className="floating-input-2">
              <input type="text" placeholder=" " required />
              <label>Estado</label>
            </div>
            <div className="floating-input-2">
              <input type="text" placeholder=" " required />
              <label>Cidade</label>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          </div>
        </div>
        )}

        <p style={{ fontWeight: "500", marginBottom: "8px" }}>Tem um cupom de desconto?</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", width: "100%" }}>
          <div className="cupom">
            <input
              type="text"
              placeholder=" "
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
              required
            />
            <label>Inserir código de desconto</label>
          </div>
          <button
            onClick={aplicarCupom}
            style={{
              backgroundColor: "#013a63",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              width: "20%",
              height: "50px",
              marginTop: "3%",
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
            <option value="evelyn">Evelyn Lohanny Santos Da Silva</option>
            <option value="novo">Cadastrar novo dependente</option>
          </select>
        </div>

        {mostrarModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", width: "30%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Cadastre um novo dependente!</h3>
                <button onClick={() => setMostrarModal(false)} style={{ border: "none", background: "none", fontSize: "20px" }}>×</button>
              </div>
              <div className="floating-input-3">
                <input type="text" placeholder=" " required />
                <label>Nome Completo</label>
              </div>
              <div className="floating-input-3">
                <input type="date" placeholder=" " required />
                <label>Data de Nascimento</label>
              </div>
              <div className="floating-select">
                <select required>
                  <option value="" disabled selected hidden></option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
                <label>Gênero</label>
              </div>
              <button style={{ width: "100%", marginTop: "16px", backgroundColor: "#013a63", color: "white", padding: "15px", border: "none", borderRadius: "4px", fontWeight: "600", fontSize: "1em" }}>Cadastrar</button>
            </div>
          </div>
        )}

        <button onClick={handleFinalizar} style={{ width: "100%", marginTop: "24px", backgroundColor: "#013a63", color: "white", padding: "12px", border: "none", borderRadius: "4px", fontWeight: "600" }}>
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
                <p><strong>Data</strong> 12/04/25</p>
                <p><strong>Horário</strong> 10:00</p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "5%" }}>
                <button style={{ backgroundColor: "#013a63", color: "white", padding: "12px 20px", border: "none", borderRadius: "4px", fontSize: "16px" }}>Alterar</button>
                <button onClick={handleRemoverAgendamento} style={{ padding: "8px 16px", border: "2px solid #ddd", borderRadius: "4px", backgroundColor: "transparent" }}>Remover</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
