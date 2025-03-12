import { createBrowserRouter } from 'react-router-dom'

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
import Inicio from '../pages/Inicio.jsx'
=======
import Inicio from '../pages/Inicio.jsx'
import Landing_page from '../pages/Landing_page.jsx'
>>>>>>> c54bdc2818896d9afc65e5d9628ef26f5d869a02

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
},
{
    path: '/inicio',
    element: <Inicio />
}
=======
    path: '/inicio',
    element: <Inicio />
},
{
    path: '/landingPage',
    element: <Landing_page />

},
>>>>>>> c54bdc2818896d9afc65e5d9628ef26f5d869a02

])

export default router