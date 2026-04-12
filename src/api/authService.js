import api from './axiosConfig'

export const authService = {

  async login(data) {
    const res = await api.post('/auth/token', {
      email: data.email,
      password: data.password
    })
    const token = res.data.token
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
