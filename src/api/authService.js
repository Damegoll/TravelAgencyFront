import api from './axiosConfig'

export const authService = {

  async login(data) {
    const res = await api.post('/auth/login', data)
    const token = res.data.token ?? res.data
    localStorage.setItem('token', token)
    return token
  },


  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {

    }
    localStorage.removeItem('token')
  },


  async getCurrentUser() {
    const res = await api.get('/auth/me')
    return res.data
  },
}
