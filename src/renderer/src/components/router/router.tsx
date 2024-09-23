import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
// import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import Applicants from '../pages/Applicants/home'
import FormApplicant from '../pages/Applicants/formApplicant'
import FormAccredited from '../pages/accredited/formAccredited'
import Accredited from '../pages/accredited/home'
import Dismissal from '../pages/dismissal/home'
import Initialization from '../pages/Initialization/Initialization'
import FormDismissal from '../pages/dismissal/formDismissal'
import ProtectedRoute from '../layouts/protected-route'
import UpdateApplicant from '../pages/Applicants/update'
import ReportIndex from '../pages/reports'
import UpdateAccredited from '../pages/accredited/update'

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
        path: '/UpdateApplicant/:id',
        element: <ProtectedRoute element={<UpdateApplicant />} />
        // element: <Login />
      },
      {
        path: '/FormAccredited',
        element: <ProtectedRoute element={<FormAccredited />} />
        // element: <Login />
      },
      {
        path: '/UpdateAccredited/:id',
        element: <ProtectedRoute element={<UpdateAccredited />} />
        // element: <Login />
      },
      {
        path: '/PrintAccredited/:id',
        element: <ProtectedRoute element={<UpdateAccredited />} />
        // element: <Login />
      },
      {
        path: '/accredited',
        element: <ProtectedRoute element={<Accredited />} />
        // element: <Login />
      },
      {
        path: '/logout',
        element: <ProtectedRoute element={<Login />} />
        // element: <Login />
      },
      {
        path: '/dismissal',
        element: <ProtectedRoute element={<Dismissal />} />
        // element: <Login />
      },
      {
        path: '/formDismissal',
        element: <ProtectedRoute element={<FormDismissal />} />
        // element: <Login />
      },
      {
        path: '/Initialization',
        element: <ProtectedRoute element={<Initialization />} />
        // element: <Login />
      },
      {
        path: '/Reports',
        element: <ProtectedRoute element={<ReportIndex />} />
        // element: <Login />
      }
    ]
  }
])
