import React, { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  guest: 'guest',
  driver: 'driver',
  passenger: 'passenger',
  police: 'police',
  admin: 'admin',
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(ROLES.guest)

  const loginAs = (nextRole) => setRole(nextRole)
  const logout = () => setRole(ROLES.guest)

  const value = useMemo(() => ({
    isAuthenticated: role !== ROLES.guest,
    role,
    loginAs,
    logout,
  }), [role])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
