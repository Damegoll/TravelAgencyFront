import api from './axiosConfig'
import type { TravelPackage } from '../types'

export const packageService = {

  async getAllPackages(): Promise<TravelPackage[]> {
    const res = await api.get<TravelPackage[]>('/packages')
    return res.data
  },


  async getAllPackagesAdmin(): Promise<TravelPackage[]> {
    const res = await api.get<TravelPackage[]>('/packages/all')
    return res.data
  },

  async getPackageById(id: string): Promise<TravelPackage> {
    const res = await api.get<TravelPackage>(`/packages/${id}`)
    return res.data
  },

  async createPackage(data: Omit<TravelPackage, 'packageId'>): Promise<TravelPackage> {
    const res = await api.post<TravelPackage>('/packages', data)
    return res.data
  },

  async updatePackage(id: string, data: Partial<TravelPackage>): Promise<TravelPackage> {
    const res = await api.put<TravelPackage>(`/packages/${id}`, data)
    return res.data
  },

  async deletePackage(id: string): Promise<void> {
    await api.delete(`/packages/${id}`)
  },

  async updatePackageStatus(id: string, status: string): Promise<TravelPackage> {
    const res = await api.put<TravelPackage>(`/packages/${id}/status`, { status })
    return res.data
  },
}
