import { createBrowserRouter } from 'react-router-dom'
import VisualizarProfissional from '../pages/VisualizarProfissional.jsx'
import TelaAgendamento from '../pages/TelaAgendamento.jsx'
import EditarPaciente from '../pages/EditarPaciente.jsx'
import EditarProfissional from '../pages/EditarProfissional.jsx'
import Chat from '../pages/Chat.jsx'
import DiarioEmocional from '../pages/DiarioEmocional.jsx'
import Plano_saude from '../pages/Plano_saude.jsx'
// import Footer from '../Components/Footer.jsx'
// import Navbar from '../Components/Navbar.jsx'
import Landing_page from '../pages/Landing_page.jsx'
import Inicio from '../pages/Inicio.jsx'
import Pagamento from '../pages/Pagamento.jsx'
import CadastroProfissional1 from '../pages/CadastroProfissional1.jsx'
import CadastroProfissional2 from '../pages/Login.jsx'
import Login from '../pages/Login.jsx'
import CadastroPaciente from '../pages/CadastroPaciente.jsx'
import Politica from '../pages/Politica.jsx'
import Termos from '../pages/Termos.jsx'
import Testeagenda from '../pages/Testeagenda.jsx'


const router = createBrowserRouter([

{
    path: '/profissional',
    element: <VisualizarProfissional />
},
{
    path: '/agendamento',
    element: <TelaAgendamento />
},

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
// {
//     path: '/footer',
//     element: <Footer/>
// },
// {
//     path: '/nav',
//     element: <Navbar />
// },
{
    path: '/landingPage',
    element: <Landing_page/>
},
{
    path: '/inicio',
    element: <Inicio />
},
{
    path: '/pagamento',
    element: <Pagamento />
},
{
    path: '/cadastroprofissional1',
    element: <CadastroProfissional1 />
},
{
    path: '/Login',
    element: <Login />
},
{
    path: '/cadastroPaciente',
    element: <CadastroPaciente />
},
{
    path: 'termo',
    element: <Termos />
},
{
    path: 'politica',
    element: <Politica />
},
{
    path: '/testeag',
    element: <Testeagenda />
},

])

export default router