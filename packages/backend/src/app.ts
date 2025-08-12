import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import appConfig from './config/app'
import { notFoundHandler, errorHandler } from './middleware/error'
import router from './routes'

const app = express()

app.use(
  express.json({
    limit: appConfig.requestBodySizeLimit,
  }),
)
app.use(
  express.urlencoded({
    extended: true,
    limit: appConfig.requestBodySizeLimit,
  }),
)

app.use(cors(appConfig.corsOptions))
app.use(cookieParser())

app.use('/api', router)

app.use('/health', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Book Club API provider',
    timestamp: new Date().toISOString(),
  })
})

app.use(notFoundHandler)
app.use(errorHandler)

export default app