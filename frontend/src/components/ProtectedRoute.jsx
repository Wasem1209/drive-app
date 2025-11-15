import React from 'react'
import { Navigate } from '../router/HashRouter.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

export default function ProtectedRoute({ allowedRoles = [], element = null }) {
  const { role, isAuthenticated } = useAuth()
  const allowed = allowedRoles.includes(role)

  if (!isAuthenticated || !allowed) {
    return <Navigate to="/unauthorized" replace />
  }

  return element
}
