<<<<<<< HEAD
import { createBrowserRouter } from 'react-router-dom'
import Pagamento from '../pages/Pagamento'
import VisualizarProfissional from '../pages/VisualizarProfissional.jsx'
import TelaAgendamento from '../pages/TelaAgendamento.jsx'
import EditarPaciente from '../pages/EditarPaciente.jsx'
import EditarProfissional from '../pages/EditarProfissional.jsx'
import Chat from '../pages/Chat.jsx'
import DiarioEmocional from '../pages/DiarioEmocional.jsx'
import Plano_saude from '../pages/Plano_saude.jsx'
import Footer from '../Components/Footer.jsx'
import Navbar from '../Components/Navbar.jsx'
import Landing_page from '../pages/Landing_page.jsx'
import EditarFoto from '../Components/EditarFoto.jsx'
=======
import { createBrowserRouter } from "react-router-dom";
import VisualizarProfissional from "../pages/VisualizarProfissional.jsx";
import TelaAgendamento from "../pages/TelaAgendamento.jsx";
import EditarPaciente from "../pages/EditarPaciente.jsx";
import EditarProfissional from "../pages/EditarProfissional.jsx";
import Chat from "../pages/Chat.jsx";
import DiarioEmocional from "../pages/DiarioEmocional.jsx";
import Plano_saude from "../pages/Plano_saude.jsx";
// import Footer from '../Components/Footer.jsx'
// import Navbar from '../Components/Navbar.jsx'
import Landing_page from "../pages/Landing_page.jsx";
import Inicio from "../pages/Inicio.jsx";
import Pagamento from "../pages/Pagamento.jsx";
import CadastroProfissional1 from "../pages/CadastroProfissional1.jsx";
import Login from "../pages/Login.jsx";
import CadastroPaciente from "../pages/CadastroPaciente.jsx";
import CadastroProfissional2 from "../pages/CadastroProfissional2.jsx";
import Politica from "../pages/Politica.jsx";
import Termos from "../pages/Termos.jsx";
import Consulta from "../pages/Consulta.jsx";
import Text_modal from "../pages/Text_modal.jsx";
>>>>>>> 4f1ba0a41041783c19eae54b24ddf55df479ba0d

const router = createBrowserRouter([
  {
    path: "/profissional/:id",
    element: <VisualizarProfissional />,
  },
  {
    path: "/agendamento",
    element: <TelaAgendamento />,
  },

<<<<<<< HEAD
{   path: '/editarprofissional',
    element: <EditarProfissional />
},
{
    path: '/paciente',
    element: <EditarPaciente />
},
{
    path: '/chats',
    element: <Chat />
},
{
    path: '/diarioemocional',
    element: <DiarioEmocional />
},
{
    path: '/planoSaude',
    element: <Plano_saude/>
},
{
    path: '/footer',
    element: <Footer/>
},
{
    path: '/nav',
    element: <Navbar />
},
{
    path: '/landingPage',
    element: <Landing_page/>
},
{
    path: '/foto',
    element: <EditarFoto />
}
=======
  { path: "/editarprofissional", element: <EditarProfissional /> },
  {
    path: "/paciente",
    element: <EditarPaciente />,
  },
  {
    path: "/chats",
    element: <Chat />,
  },
  {
    path: "/diarioemocional",
    element: <DiarioEmocional />,
  },
  {
    path: "/planoSaude",
    element: <Plano_saude />,
  },
  {
    path: "/",
    element: <Landing_page />,
  },
  {
    path: "/inicio",
    element: <Inicio />,
  },
  {
    path: "/pagamento",
    element: <Pagamento />,
  },
  {
    path: "/cadastroprofissional1",
    element: <CadastroProfissional1 />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/cadastroPaciente",
    element: <CadastroPaciente />,
  },
  {
    path: "/cadastroProfissional2",
    element: <CadastroProfissional2 />,
  },
  {
    path: "termo",
    element: <Termos />,
  },
  {
    path: "politica",
    element: <Politica />,
  },
  {
    path: "consulta",
    element: <Consulta />,
  },
  {
    path: "text_modal",
    element: <Text_modal />,
  },
]);
>>>>>>> 4f1ba0a41041783c19eae54b24ddf55df479ba0d

export default router;
