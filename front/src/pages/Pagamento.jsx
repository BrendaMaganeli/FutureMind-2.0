<<<<<<< HEAD
import React from 'react';
import { CheckoutForm, Return } from '../Components/Pag.jsx';

function Pagamento() {
  return (
    <div>
      <CheckoutForm />
      <Return />
    </div>
  );
}
=======
// import { useState } from "react";

// const Pagamento = () => {
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/checkout", { 
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       const data = await response.json();
//       if (data.url) {
//         window.location.href = data.url; // Redireciona para Stripe Checkout
//       }
//     } catch (error) {
//       console.error("Erro ao iniciar pagamento:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button onClick={handleCheckout} disabled={loading}>
//       {loading ? "Processando..." : "Pagar"}
//     </button>
//   );
// };
>>>>>>> e59579f6469513506aa498f9051a5c7fc44385b3

// export default Pagamento;
