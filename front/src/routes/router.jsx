import { createBrowserRouter } from "react-router-dom";
import VisualizarProfissional from "../pages/VisualizarProfissional.jsx";
import TelaAgendamento from "../pages/TelaAgendamento.jsx";
import EditarPaciente from "../pages/EditarPaciente.jsx";
import EditarProfissional from "../pages/EditarProfissional.jsx";
import Chat from "../pages/Chat.jsx";
import Plano_saude from "../pages/Plano_saude.jsx";
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
import VideoConferencia from "../pages/Call.jsx";
import ErrorElement from "../Components/ErrorElement.jsx";

const router = createBrowserRouter([
  {
    path: "/profissional/:id",
    element: <VisualizarProfissional />,
  },
  {
    path: "/agendamento/:id",
    element: <TelaAgendamento />,
  },

  { 
    path: "/editarprofissional", 
    element: <EditarProfissional /> 
  },
  {
    path: "/paciente",
    element: <EditarPaciente />,
  },
  {
    path: "/chats",
    element: <Chat />,
  },
  {
    path: "/planoSaude",
    element: <Plano_saude />,
  },
  {
    path: "/",
    element: <Landing_page />,
    errorElement: <ErrorElement />
  },
  {
    path: "/inicio",
    element: <Inicio />,
  },
  {
    path: "/pagamento/:id",
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
    path:"/consulta/:role/:id",
    element: <Consulta />,
  },
  {
    path:"/consulta/:role/:id",
    element: <Consulta />,
  },
  {
    path: "text_modal",
    element: <Text_modal />,
  },
  {
    path: '/live/:id',
    element: <VideoConferencia />
  }
]);

export default router;