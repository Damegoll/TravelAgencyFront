import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import keycloak from '../api/keycloak'
import { authService } from '../api/authService'


const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = user?.roles?.includes('ADMIN') ?? false

  const phone = user?.phone ?? null

  useEffect(() => {
    // Since keycloak.init({ onLoad: 'login-required' }) already ran in main.jsx,
    // at this point we are guaranteed to be authenticated.
    // Derive user info from the keycloak token.
    if (keycloak.authenticated) {
      authService
        .getCurrentUser()
        .then(setUser)
        .catch((err) => {
          console.error('Failed to load user profile:', err)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async () => {
    // With login-required, the user is already logged in via Keycloak.
    // This is kept for API compatibility but shouldn't be needed.
    keycloak.login()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    keycloak.logout({ redirectUri: window.location.origin })
  }, [])

  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        phone,
        isAuthenticated: keycloak.authenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
