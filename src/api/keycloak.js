import Keycloak from "keycloak-js";

keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
    pkceMethod: 'S256',
})


const keycloak = new Keycloak({
    url: "https://146.190.78.157:8443",
    realm: "TravelAgencyRealm",
    clientId: "travelagency-app",

});

export default keycloak;