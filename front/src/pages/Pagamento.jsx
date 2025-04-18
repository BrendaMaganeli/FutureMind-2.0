import React, { useState } from "react";
import './CSS/Pagamento.css'
import Seta from '../assets/caret-down-solid.svg'

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
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "16px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
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
              <input type="checkbox" id="padrao" />
              <label htmlFor="padrao" style={{ fontSize: "14px" }}>Definir esse cartão como método de pagamento padrão</label>
            </div>
          </div>
        )}

        {metodoSelecionado === "boleto" && (
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <p style={{ fontWeight: "500", marginBottom: "8px" }}>O boleto será gerado após o agendamento e enviado para seu e-mail cadastrado.</p>
          </div>
        )}

        {metodoSelecionado === "pix" && (
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <p style={{ fontWeight: "500", marginBottom: "8px" }}>O QR Code do Pix será gerado após o agendamento.</p>
          </div>
        )}

        <p style={{ fontWeight: "500", marginBottom: "8px" }}>Tem um cupom de desconto?</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", width: "100%" }}>
          <div className="cupom">
            <input type="text" placeholder=" " required />
            <label>Inserir código de desconto</label>
          </div>
          <button style={{ backgroundColor: "#013a63", color: "white", padding: " 8px 16px", border: "none", borderRadius: "4px", width: "20%", height: "50px", marginTop: "3%", cursor: "pointer" }}>Aplicar</button>
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
          style={{ width: "100%", height: "45px", padding: "8px", marginTop: "8px", backgroundColor: "rgba(247, 249, 251)", border: "0.5px solid rgba(231, 234, 244)", borderRadius: "4px", cursor: "pointer", paddingRight: "36px", backgroundPosition: "right 10px center", backgroundRepeat: "no-repeat", appearance: "none", backgroundImage: {Seta}
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

      {/* COLUNA DIREITA (RESUMO + AGENDAMENTO) */}
      <div>
        <div style={{ border: "1px solid #ddd", padding: "30px", borderRadius: "8px" }}>
          <p style={{ fontWeight: "600" }}>Resumo</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>Consultas</span>
            <span>R$165</span>
          </div>
          <div style={{ borderTop: "1px solid #eee", margin: "8px 0" }}></div>
          <div style={{ fontWeight: "700", textAlign: "right", fontSize: "18px" }}>
            Valor a ser pago <br />
            <span style={{ fontSize: "22px" }}>R$165</span>
          </div>

          <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "600", marginTop: "16px" }}>Agendamentos</p>
          <div style={{ display: "flex", alignItems: "center", gap: "25px", marginTop: "12px" }}>
            <img src="https://via.placeholder.com/40" alt="Foto profissional" style={{ borderRadius: "9999px", width: "40px", height: "40px" }} />
            <div>
              <p style={{ fontWeight: "500" }}>Jeciana Botelho</p>
              <p style={{ fontSize: "14px", color: "#888" }}>CRP 03/10307</p>
              <p style={{ fontSize: "14px" }}>Atendimento Online</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <div style={{ fontSize: "14px" }}>
              <p><strong>Data</strong> 12/04/25</p>
              <p><strong>Horário</strong> 10:00</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ backgroundColor: "#ff6b00", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}>Alterar</button>
              <button onClick={handleRemoverAgendamento} style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "4px" }}>Remover</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
