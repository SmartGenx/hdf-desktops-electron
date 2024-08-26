import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
// import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import Applicants from '../pages/Applicants/home'
import FormApplicant from '../pages/Applicants/formApplicant'
import FormAccredited from '../pages/accredited/formAccredited'
import Accredited from '../pages/accredited/home'
import ProtectedRoute from '../layouts/protected-route'

export const router = createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={<Home />} />
        // element: <Home />
      },
      {
        path: '/applicants',
        element: <ProtectedRoute element={<Applicants />} />
        // element: <Login />
      },
      {
        path: '/FormApplicant',
        element: <ProtectedRoute element={<FormApplicant />} />
        // element: <Login />
      },
      {
        path: '/FormAccredited',
        element: <ProtectedRoute element={<FormAccredited />} />
        // element: <Login />
      },
      {
        path: '/accredited',
        element: <ProtectedRoute element={<Accredited />} />
        // element: <Login />
      }
    ]
  }
])
