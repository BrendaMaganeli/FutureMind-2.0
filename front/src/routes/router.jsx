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
<<<<<<< HEAD
import Landing_page from '../pages/Landing_page.jsx'
=======
import Inicio from '../pages/Inicio.jsx'
>>>>>>> d93f1f7c4a1ddaff59cf77c5501b8177a8e1bb65

const router = createBrowserRouter([
{
    path: '/pagamento',
    element: <Pagamento /> 
},
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
{
    path: '/footer',
    element: <Footer/>
},
{
    path: '/nav',
    element: <Navbar />
},
{
<<<<<<< HEAD
    path: '/landingPage',
    element: <Landing_page/>
}
=======
    path: '/inicio',
    element: <Inicio />
},
>>>>>>> d93f1f7c4a1ddaff59cf77c5501b8177a8e1bb65

])

export default router