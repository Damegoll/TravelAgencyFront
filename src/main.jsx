import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import keycloak from './api/keycloak'

// Guard against double-init (e.g. React StrictMode in dev, or HMR)
let keycloakInitialized = false;

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

if (!keycloakInitialized) {
  keycloakInitialized = true;

  keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.warn("Keycloak: user not authenticated after init");
        // login-required should have redirected, so this shouldn't happen.
        // Avoid doing anything that would trigger another init/redirect.
        document.getElementById('root').innerHTML = "Unauthorized"
      } else {
        console.log("Keycloak: authentication successful");
        // Store the token so axios interceptors and authService can use it
        localStorage.setItem('token', keycloak.token);
        if (keycloak.refreshToken) {
          localStorage.setItem('refresh_token', keycloak.refreshToken);
        }
        renderApp();
      }
    })
    .catch((error) => {
      console.error("Keycloak: initialization failed", error);
      document.getElementById('root').innerHTML =
        '<div style="padding:2rem;text-align:center;">' +
        '<h2>Authentication Error</h2>' +
        '<p>Could not connect to the authentication server. Please try again later.</p>' +
        '</div>';
    });

  // Set up automatic token refresh
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