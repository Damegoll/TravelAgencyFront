import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, LoginData, RegisterData } from '../types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('travel-agency-user')
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch {
      localStorage.removeItem('travel-agency-user')
    }
    setIsLoading(false)
  }, [])

  const login = async (data: LoginData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!data.email || !data.password) {
      return { success: false, error: 'Email and password are required' }
    }

    const mockUser: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: data.email,
      role: 'CUSTOMER',
    }

    setUser(mockUser)
    localStorage.setItem('travel-agency-user', JSON.stringify(mockUser))
    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockUser: User = {
      id: 'user-' + Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'CUSTOMER',
    }

    setUser(mockUser)
    localStorage.setItem('travel-agency-user', JSON.stringify(mockUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('travel-agency-user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
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
