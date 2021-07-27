import session  from 'express-session'
import Keycloak  from 'keycloak-connect'

let _keycloak: any;

const keycloakConfig: any = {
  clientId: 'monitor-api',
  bearerOnly: false,
  serverUrl: "http://localhost:8190/auth/",
  realm: 'CIGEO'
};


function initKeycloak() {
  if (_keycloak) {
    console.warn("Trying to init Keycloak again!");
    return _keycloak;
  }
  else {
    console.log("Initializing Keycloak...");
    const memoryStore = new session.MemoryStore();
    _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
    return _keycloak;
  }
}

function getKeycloak() {
  if (!_keycloak){
    console.error('Keycloak has not been initialized. Please called init first.');
  }
  return _keycloak;
}

export {
  initKeycloak,
  getKeycloak
};