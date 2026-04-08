import api from './axiosConfig'

export const reservationService = {

  async getUserReservations() {
    const res = await api.get('/reservations')
    return res.data
  },


  async getAllReservations() {
    const res = await api.get('/reservations/all')
    return res.data
  },

  async getReservationById(id) {
    const res = await api.get(`/reservations/${id}`)
    return res.data
  },

  async createReservation(data) {
    const res = await api.post('/reservations', data)
    return res.data
  },

  async updateReservation(id, data) {
    const res = await api.put(`/reservations/${id}`, data)
    return res.data
  },

  async cancelReservation(id) {
    await api.delete(`/reservations/${id}`)
  },
}
