import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../api/authService'


const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = user?.roles?.includes('ADMIN') ?? false

  const phone = user?.phone ?? null

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }
    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (data) => {
    try {
      await authService.login(data)
      const me = await authService.getCurrentUser()
      setUser(me)
      return { success: true }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Credenciales inválidas'
      return { success: false, error: message }
    }
  }, [])



  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        phone,
        isAuthenticated: !!user,
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
