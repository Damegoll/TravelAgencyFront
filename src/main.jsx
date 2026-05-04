import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import keycloak from './keycloak'

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false
})
  .then((authenticated) => {
    if (!authenticated) {
      console.log("Unauthorized user, please check this");
      window.location.reload();
    } else {
      console.log("Authentification succesful");
      localStorage.setItem('kc_token', keycloak.token);
      ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )
    }
  })
  .catch((error) => {
    console.error("Error in Keycloak authentication", error);
  });