import './CSS/Pix.css';
import { useState } from 'react';
import axios from 'axios';

function Pix() {
  const [pixData, setPixData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePix = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/create-payment-intent", {
        params: {
          amount: 50,
          currency: "brl",
          payment_method_type: "pix",
        }
      });
      setPixData(data.clientSecret);
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container-pix">
      <button onClick={generatePix} className='botaoPag-styles' disabled={loading}>
        {loading ? "Gerando Pix..." : "Gerar QR Code"}
      </button>
      {pixData && <p>Escaneie o QR Code com seu app de banco.</p>}
    </div>
  );
}

export default Pix;
