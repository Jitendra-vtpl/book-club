const ENV = process.env.REACT_APP_ENV || 'development'
const isDev = ENV === 'development'

const API_URL = isDev
  ? process.env.REACT_APP_API_URL || 'http://localhost:7000/api'
  : process.env.REACT_APP_API_URL || ''

let apiUrl = new URL(API_URL).toString()
apiUrl = apiUrl.substring(0, apiUrl.length - (apiUrl.endsWith('/') ? 1 : 0))

const apiBaseUrl = apiUrl.substring(0, apiUrl.lastIndexOf('/'))

export const CONSTANTS = {
  API_URL: apiUrl,
  API_BASE_URL: apiBaseUrl,
}

export default CONSTANTS