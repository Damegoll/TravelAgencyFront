import api from './axiosConfig'

export const discountService = {

  async getAllDiscounts() {
    const res = await api.get('/discounts')
    return res.data
  },

  async getActiveDiscounts() {
    const res = await api.get('/discounts/active')
    return res.data
  },

  async createDiscount(data) {
    const res = await api.post('/discounts', data)
    return res.data
  },

  async updateDiscount(id, data) {
    const res = await api.put(`/discounts/${id}`, data)
    return res.data
  },

  async deleteDiscount(id) {
    await api.delete(`/discounts/${id}`)
  },
}
