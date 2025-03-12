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

// export default Pagamento;
