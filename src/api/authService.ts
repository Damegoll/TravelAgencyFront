import api from './axiosConfig'
import type { User, LoginData } from '../types'

export const authService = {

  async login(data: LoginData): Promise<string> {
    const res = await api.post('/auth/login', data)
    const token: string = res.data.token ?? res.data
    localStorage.setItem('token', token)
    return token
  },


  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {

    }
    localStorage.removeItem('token')
  },


  async getCurrentUser(): Promise<User> {
    const res = await api.get<User>('/auth/me')
    return res.data
  },
}
