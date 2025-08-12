import { createServer } from 'http'
import app from './app'
import SocketService from './services/socket'
import appConfig from './config/app'
import logger from './helpers/logger'
import { connectDB } from './config/database'

const server = createServer(app)

// Initialize socket service
const socketService = new SocketService(server)

server.listen(appConfig.port, async () => {
  await connectDB()
  logger.info(`Server is running on ${appConfig.baseUrl}`)
})

export { socketService }
