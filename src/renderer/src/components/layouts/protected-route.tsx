import { Navigate } from 'react-router-dom'
import React from 'react'
import { useIsAuthenticated } from 'react-auth-kit'

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }
  // If authenticated, render the passed component
  return element
}

export default ProtectedRoute
