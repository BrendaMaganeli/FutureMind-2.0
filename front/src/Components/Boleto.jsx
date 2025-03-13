import './CSS/Boleto.css';
import { useState } from 'react';
import axios from 'axios';

function Boleto() {
  const [boletoData, setBoletoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateBoleto = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/create-boleto", {
        params: {
          amount: 50,
          currency: "brl",
        }
      });
      setBoletoData(data.boleto);
    } catch (error) {
      console.error("Erro ao gerar boleto:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container-boleto">
      <button onClick={generateBoleto} className='botaoPag-styles' disabled={loading}>
        {loading ? "Gerando Boleto..." : "Gerar Boleto"}
      </button>
      {boletoData && (
        <div>
          <p>Código de Barras: {boletoData.codigo_barras}</p>
          <p>Vencimento: {boletoData.vencimento}</p>
        </div>
      )}
    </div>
  );
}

export default Boleto;
