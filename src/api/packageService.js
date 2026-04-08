import api from './axiosConfig'

export const packageService = {

  async getAllPackages() {
    const res = await api.get('/packages')
    return res.data
  },


  async getAllPackagesAdmin() {
    const res = await api.get('/packages/all')
    return res.data
  },

  async getPackageById(id) {
    const res = await api.get(`/packages/${id}`)
    return res.data
  },

  async createPackage(data) {
    const res = await api.post('/packages', data)
    return res.data
  },

  async updatePackage(id, data) {
    const res = await api.put(`/packages/${id}`, data)
    return res.data
  },

  async deletePackage(id) {
    await api.delete(`/packages/${id}`)
  },

  async updatePackageStatus(id, status) {
    const res = await api.put(`/packages/${id}/status`, { status })
    return res.data
  },
}
