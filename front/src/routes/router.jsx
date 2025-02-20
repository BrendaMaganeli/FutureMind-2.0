import { createBrowserRouter } from 'react-router-dom'
import Pagamento from '../pages/Pagamento'
import VisualizarProfissional from '../pages/VisualizarProfissional.jsx'
import TelaAgendamento from '../pages/TelaAgendamento.jsx'
import EditarPaciente from '../pages/EditarPaciente.jsx'
import EditarProfissional from '../pages/EditarProfissional.jsx'

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


])

export default router