import './CSS/Debito.css';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

function Credito() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("http://localhost:5000/create-payment-intent", {
        params: {
          amount: 50,
          currency: "brl",
          payment_method_type: "card",
        }
      });

      const { clientSecret } = data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-debito">
      <form onSubmit={handleSubmit} className='infoCard'>
        <p>Informações do Cartão</p>
        <CardElement className="input-debito" />
        <button className='botaoPag-styles' disabled={loading || !stripe}>
          {loading ? "Processando..." : "Concluir"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Pagamento realizado com sucesso!</p>}
    </div>
  );
}

export default Credito;
