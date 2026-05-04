import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import keycloak from './api/keycloak'

let keycloakInitialized = false;

function setAuthStatus(message) {
  const root = document.getElementById('root')
  if (!root) return
  root.innerHTML =
    '<div style="padding:1rem;font-family:system-ui,Arial,sans-serif;font-size:14px;color:#1f2937;">' +
    message +
    '</div>'
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

if (!keycloakInitialized) {
  keycloakInitialized = true;
  setAuthStatus('Keycloak init started...')

  keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      setAuthStatus(`Keycloak authenticated: ${authenticated ? 'true' : 'false'}`)
      if (!authenticated) {
        console.warn("Keycloak: user not authenticated after init");
        setAuthStatus('Keycloak authenticated: false (Unauthorized)')
      } else {
        console.log("Keycloak: authentication successful");
        localStorage.setItem('token', keycloak.token);
        if (keycloak.refreshToken) {
          localStorage.setItem('refresh_token', keycloak.refreshToken);
        }
        renderApp();
      }
    })
    .catch((error) => {
      console.error("Keycloak: initialization failed", error);
      const message = error?.message || 'Unknown error'
      setAuthStatus(`Keycloak init error: ${message}`)
    });

  keycloak.onTokenExpired = () => {
    keycloak.updateToken(30)
      .then((refreshed) => {
        if (refreshed) {
          console.log("Keycloak: token refreshed");
          localStorage.setItem('token', keycloak.token);
          if (keycloak.refreshToken) {
            localStorage.setItem('refresh_token', keycloak.refreshToken);
          }
        }
      })
      .catch(() => {
        console.error("Keycloak: failed to refresh token, logging out");
        keycloak.logout();
      });
  };
}