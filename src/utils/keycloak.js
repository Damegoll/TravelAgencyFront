export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180'
export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'TravelAgencyRealm'
export const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'travelagency-app'

export function getKeycloakTokenUrl() {
  return `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`
}

export function getKeycloakRegistrationUrl() {
  const redirectUri = encodeURIComponent(`${window.location.origin}/login`)
  return (
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/registrations` +
    `?client_id=${KEYCLOAK_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=openid`
  )
}
