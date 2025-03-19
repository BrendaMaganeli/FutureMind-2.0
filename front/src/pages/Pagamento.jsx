import React from 'react';
import { CheckoutForm, Return } from '../Components/Pag.jsx';
import './CSS/Pagamento.css';

function Pagamento() {
  return (
    <div>
      <CheckoutForm />
      <Return />
    </div>
  );
}

export default Pagamento;

// import React from "react";
// import "./styles.css";

// const PaymentScreen = () => {
//     return (
//         <div className="container">
//             <div className="left-section">
//                 <div>
//                     <div className="profile">
//                         <i className="fas fa-user-circle"></i>
//                         <span style={{ fontSize: "22px" }}>Joan Silva</span>
//                     </div>
//                     <p className="title">Seu bem-estar começa aqui.</p>
//                     <p className="bold">Valor Total:</p>
//                     <p style={{ fontSize: "22px" }}>R$50,00</p>
//                     <div className="appointment">
//                         <i className="fas fa-user-md"></i>
//                         <div>
//                             <p className="bold">Dr. Joan Silva</p>
//                             <p style={{ fontSize: "22px" }}>12/08 - às 18h até 19h</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="footer">
//                     futuremind | política de privacidade
//                 </div>
//             </div>
//             <div className="right-section"></div>
//         </div>
//     );
// };

// export default PaymentScreen;
