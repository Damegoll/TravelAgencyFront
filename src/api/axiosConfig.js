import axios from 'axios'
import keycloak from './keycloak'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL) || '/api',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      // Only redirect to Keycloak if the user is not already authenticated.
      // This avoids infinite loops when a token is invalid or the API rejects it.
      if (!keycloak.authenticated) {
        keycloak.login()
      }
    }
    return Promise.reject(error)
  }
)

export default api

