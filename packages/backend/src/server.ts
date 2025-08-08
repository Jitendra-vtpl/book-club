import app from './app'
import appConfig from './config/app'

app.listen(appConfig.port, () => {
  console.log(`Server is running on ${appConfig.baseUrl}`)
})
