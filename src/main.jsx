import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import keycloak from './api/keycloak'

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256',
})
  .then((authenticated) => {
    if (!authenticated) {
      console.log("Unauthorized user, please check this");
      document.getElementById('root').innerHTML = "Unauthorized"
    } else {
      console.log("Authentification succesful");
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