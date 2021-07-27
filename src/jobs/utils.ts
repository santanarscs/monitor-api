import axios, { AxiosRequestConfig } from 'axios'
import querystring from 'querystring'

async function getTokenKeycloak() {
  try {
    const defaultConfig: AxiosRequestConfig = {
      baseURL: process.env.KEYCLOAK_BASE_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    const params = querystring.stringify({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: process.env.KEYCLOAK_USER_WITH_ROLE_VIEW_USERS,
      password: process.env.KEYCLOAK_PASSWORD_WITH_ROLE_VIEW_USERS
    })
    
    const api = axios.create(defaultConfig)
    const { data } = await api.post('auth/realms/CIGEO/protocol/openid-connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const {access_token} = data
    return access_token;
  }catch(e) {
    console.log(e)
  }
}

async function getUsers(token: string) {
  try {
    const api = axios.create()
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const { data } = await api.get(`${process.env.KEYCLOAK_BASE_URL}/auth/admin/realms/CIGEO/users`)
    return data;
  }catch(e) {
    console.log(e)
  }
}

export {getUsers, getTokenKeycloak}