import environment from './environment'

const appEnv = environment.APP_ENV || 'development'
const host = environment.HOST || 'localhost'
const protocol = environment.PROTOCOL || 'http'
const port = environment.PORT || 7000

let apiUrl = new URL(environment.API_URL || `${protocol}://${host}:${port}/api`).toString()
// apiUrl = apiUrl.substring(0, apiUrl.length - 1)
apiUrl = apiUrl.substring(0, apiUrl.length - (apiUrl.endsWith('/') ? 1 : 0))

let webAppUrl = new URL(environment.WEB_APP_URL || 'http://localhost:7001').toString()
webAppUrl = webAppUrl.substring(0, webAppUrl.length - (webAppUrl.endsWith('/') ? 1 : 0))

const appConfig = {
  host,
  protocol,
  port,
  appEnv: appEnv,
  isDev: appEnv === 'development',
  isTest: appEnv === 'test',
  isProd: appEnv === 'production',
  baseUrl: apiUrl.replace('/api', ''),
  requestBodySizeLimit: '1mb',
  corsOptions: {
    origin: [webAppUrl],
    // origin: '*',
    methods: 'GET,HEAD,POST,PATCH,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
  },
  socketCorsOptions: {
    origin: [webAppUrl],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  logLevel: 'info',
  db: {
    uri: environment.MONGO_DB_URI || 'mongodb://mongodb:27017',
    name: environment.MONGO_DB_NAME || 'book_club_dev',
  },
  jwt: {
    accessTokenSecret: environment.JWT_ACCESS_SECRET || 'access-key',
    refreshTokenSecret: environment.JWT_REFRESH_SECRET || 'refresh-key',
    accessTokenExpiry: '10m', // 10 minutes
    refreshTokenExpiry: '7d', // 7 days
    refreshTokenExpiryInMinutes: 7 * 24 * 60, // 7 days in minutes
  },
}

export default appConfig