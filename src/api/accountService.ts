import api from './axiosConfig'
import type { Account, RegisterData } from '../types'

export const accountService = {
  async register(data: RegisterData): Promise<Account> {
    const res = await api.post<Account>('/accounts/register', data)
    return res.data
  },

  async getAccount(id: string): Promise<Account> {
    const res = await api.get<Account>(`/accounts/${id}`)
    return res.data
  },

  async getAllAccounts(): Promise<Account[]> {
    const res = await api.get<Account[]>('/accounts')
    return res.data
  },

  async updateAccountStatus(id: string, status: string): Promise<Account> {
    const res = await api.put<Account>(`/accounts/${id}/status`, { status })
    return res.data
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`)
  },
}
