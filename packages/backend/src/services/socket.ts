import { Server as SocketIOServer, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import appConfig from '../config/app'
import logger from '../helpers/logger'
import { verifyAccessToken } from '../helpers/jwt'

interface AuthenticatedSocket extends Socket {
  user?: any
}

class SocketService {
  private io: SocketIOServer

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: appConfig.socketCorsOptions,
    })

    this.middleware()
    this.eventHandlers()
  }

  private middleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token      
        if (!token) return next(new Error('Socket authentication error'))
        
        const decoded = verifyAccessToken(token)
        if (!decoded) return next(new Error('Socket authentication error'))
        socket.user = decoded

        next()
      } catch (error) {
        logger.error('Socket authentication error:', error)
        next(new Error('Socket authentication error'))
      }
    })
  }

  private eventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      logger.info('user connected', socket.id)

      // Join book room
      socket.on('join-book', (bookId: string) => {
        socket.join(`book-${bookId}`)
        logger.info(`User joined book room: ${bookId}`)
        // socket.emit('joined-book', { bookId, message: 'Joined book room' })
      })

      // Leave book room
      socket.on('leave-book', (bookId: string) => {
        socket.leave(`book-${bookId}`)
        logger.info(`User left book room: ${bookId}`)
      })

      socket.on('disconnect', () => {
        logger.info('user disconnected', socket.id)
      })
    })
  }

  public notifyBookReview(bookId: string, options: {
    type: 'NEW_REVIEW' | 'UPDATE_REVIEW' | 'DELETE_REVIEW'
    data: any
  }) {

    const { type, data } = options

    this.io.to(`book-${bookId}`).emit(type, {
      data: data || {},
      timestamp: new Date().toISOString(),
    })
  }

  public getConnectedUsersCount = () => this.io.engine.clientsCount

  public getIO = () => this.io
}

export default SocketService