import { getKeycloakTokenUrl, KEYCLOAK_CLIENT_ID, KEYCLOAK_URL, KEYCLOAK_REALM } from '../utils/keycloak'

function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export const authService = {

  async login(data) {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: KEYCLOAK_CLIENT_ID,
      username: data.email,
      password: data.password,
    })

    const res = await fetch(getKeycloakTokenUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw { response: { data: { error: err.error_description || 'Credenciales inválidas' } } }
    }

    const tokenData = await res.json()
    localStorage.setItem('token', tokenData.access_token)
    if (tokenData.refresh_token) {
      localStorage.setItem('refresh_token', tokenData.refresh_token)
    }
    return tokenData.access_token
  },

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token')

    const payload = decodeJwtPayload(token)
    const roles = payload.realm_access?.roles || []

    let phone = ''
    try {
      const profile = await this.getKeycloakProfile()
      phone = profile.attributes?.phoneNumber?.[0] || ''
    } catch {
    }

    return {
      email: payload.email || payload.preferred_username,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      phone,
      roles,
    }
  },

  async getKeycloakProfile() {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/account`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    )
    if (!res.ok) throw new Error('Failed to fetch profile')
    return res.json()
  },

  async updateKeycloakPhone(phone) {
    const token = localStorage.getItem('token')

    const profile = await this.getKeycloakProfile()

    profile.attributes = {
      ...profile.attributes,
      phoneNumber: [phone],
    }

    const res = await fetch(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/account`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'Error al actualizar el teléfono')
    }
  },
}
