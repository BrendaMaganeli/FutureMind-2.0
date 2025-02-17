import { createBrowserRouter } from 'react-router-dom'
import Pagamento from '../pages/Pagamento'
import VisualizarProfissional from '../pages/VisualizarProfissional.jsx'

const router = createBrowserRouter([
{
    path: '/',
    element: <Pagamento /> 
},
{
    path: '/profissional',
    element: <VisualizarProfissional />
},


])

export default router