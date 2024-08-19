import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
// import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'

export const router = createHashRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        // element: <ProtectedRoute element={<Home />} />
        element: <Home />
      },
      {
        path: '/users',
        // element: <ProtectedRoute element={<Home />} />
        element: <Home />
      }
    ]
  }
])
