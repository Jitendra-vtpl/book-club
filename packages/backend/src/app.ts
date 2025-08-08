import express, { Request, Response } from 'express'
import cors from 'cors'
import appConfig from './config/app'

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

app.use('/', (req: Request, res: Response) => {
  res.send('Book Club API provider')
})

export default app