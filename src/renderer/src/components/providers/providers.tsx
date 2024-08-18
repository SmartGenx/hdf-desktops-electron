import { DirectionProvider } from '@radix-ui/react-direction'
import { AuthProvider } from 'react-auth-kit'
import { RouterProvider } from 'react-router-dom'
import { router } from '../router/router'
import { ReactQueryClientProvider } from './ReactQueryClientProvider'

const Providers = () => {
  return (
    <ReactQueryClientProvider>
      <AuthProvider
        authType={'localstorage'}
        authName={'_auth'}
      >
        <DirectionProvider dir="rtl">
          <RouterProvider router={router} />
        </DirectionProvider>
      </AuthProvider>
    </ReactQueryClientProvider>
  )
}

export default Providers
