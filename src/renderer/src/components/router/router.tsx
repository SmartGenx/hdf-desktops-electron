import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
// import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/accredited/home'
import Login from '../pages/login/login'
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
        path: '/backup',
        element: <ProtectedRoute element={<Login />} />
        // element: <Login />
      }
    ]
  }
])
