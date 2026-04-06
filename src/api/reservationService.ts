import api from './axiosConfig'
import type { Reservation, CreateReservationData } from '../types'

export const reservationService = {

  async getUserReservations(): Promise<Reservation[]> {
    const res = await api.get<Reservation[]>('/reservations')
    return res.data
  },


  async getAllReservations(): Promise<Reservation[]> {
    const res = await api.get<Reservation[]>('/reservations/all')
    return res.data
  },

  async getReservationById(id: string): Promise<Reservation> {
    const res = await api.get<Reservation>(`/reservations/${id}`)
    return res.data
  },

  async createReservation(data: CreateReservationData): Promise<Reservation> {
    const res = await api.post<Reservation>('/reservations', data)
    return res.data
  },

  async updateReservation(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const res = await api.put<Reservation>(`/reservations/${id}`, data)
    return res.data
  },

  async cancelReservation(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`)
  },
}
