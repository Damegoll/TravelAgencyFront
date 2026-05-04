import Keycloak from "keycloak-js";


const keycloak = new Keycloak({
    url: "https://146.190.78.157:8443",
    realm: "TravelAgencyRealm",
    clientId: "travelagency-app",

});

export default keycloak;