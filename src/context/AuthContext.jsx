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
    keycloak.login({ redirectUri: window.location.origin })
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
