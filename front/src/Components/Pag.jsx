import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import "./CSS/pagamento.css";

const stripePromise = loadStripe("pk_test_51R1YgHEQe3FsCkK9J8GbnR0wv2F16QD0vjhLf1WG8N9S1ofrWYczdVI0ICYateUgN2TfQo3K3R1ChKTQoMkDesZN00YuRjeg7g");

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState(null);

  const fetchClientSecret = useCallback(() => {
    return fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret recebido:", data.clientSecret);
        return data.clientSecret;
      })
      .catch((error) => console.error("Erro ao buscar Client Secret:", error));
  }, []);

  useEffect(() => {
    fetchClientSecret().then((secret) => setClientSecret(secret));
  }, [fetchClientSecret]);

  if (!clientSecret) return <p className="loading">Carregando...</p>;

  return (
    <div className="checkout-container">
      {/* Painel esquerdo - Informações do pagamento */}
      <div className="left-panel">
        <h3>Seu bem-estar começa aqui.</h3>
        <p className="total">Valor Total: <strong>R$ 800,00</strong></p>
        <div className="consultation-details">
          <img src="https://via.placeholder.com/50" alt="Foto do terapeuta" className="doctor-image" />
          <div>
            <p className="doctor-name">Dr. Joan Silva</p>
            <p className="session-time">12/08 - 18h às 19h</p>
          </div>
        </div>
        <p className="privacy-policy">📜 Termos e política de privacidade</p>
      </div>

      {/* Painel direito - Stripe Checkout */}
      <div className="right-panel">
        <div className="checkout-card">
          <h2>Finalize sua compra com segurança</h2>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
};

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    if (!sessionId) return;

    fetch(`http://localhost:4242/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      })
      .catch((error) => console.error("Erro ao buscar status da sessão:", error));
  }, []);

  useEffect(() => {
    if (status === "open") {
      navigate("/checkout");
    }
  }, [status, navigate]);

  if (!status) return <p className="loading">Verificando pagamento...</p>;

  if (status === "complete") {
    return (
      <section className="success-message">
        <p>
          Agradecemos sua compra! Um e-mail de confirmação será enviado para {customerEmail}.
          Caso tenha dúvidas, envie um e-mail para <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

export { CheckoutForm, Return };
