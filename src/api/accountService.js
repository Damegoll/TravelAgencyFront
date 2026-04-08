import api from './axiosConfig'

export const accountService = {
  async register(data) {
    const res = await api.post('/accounts/register', data)
    return res.data
  },

  async getAccount(id) {
    const res = await api.get(`/accounts/${id}`)
    return res.data
  },

  async getAllAccounts() {
    const res = await api.get('/accounts')
    return res.data
  },

  async updateAccountStatus(id, status) {
    const res = await api.put(`/accounts/${id}/status`, { status })
    return res.data
  },

  async deleteAccount(id) {
    await api.delete(`/accounts/${id}`)
  },
}
