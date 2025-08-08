import environment from './environment'

const appEnv = environment.APP_ENV || 'development'
const host = environment.HOST || 'localhost'
const protocol = environment.PROTOCOL || 'http'
const port = environment.PORT

let apiUrl = new URL(environment.API_URL || `${protocol}://${host}:${port}`).toString()
apiUrl = apiUrl.substring(0, apiUrl.length - 1)

const appConfig = {
  host,
  protocol,
  port,
  appEnv: appEnv,
  isDev: appEnv === 'development',
  isTest: appEnv === 'test',
  isProd: appEnv === 'production',
  baseUrl: apiUrl,
  requestBodySizeLimit: '1mb',
  corsOptions: {
    // origin: environment.webAppUrl,
    origin: '*',
    methods: 'GET,HEAD,POST,PATCH,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
  },
}

export default appConfig