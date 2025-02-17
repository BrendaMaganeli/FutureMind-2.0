import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'


createRoot(document.getElementById('root')).render(
 
    <RouterProvider router={router}>
    </RouterProvider>
 
);