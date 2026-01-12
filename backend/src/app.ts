import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import health from './routes/health.js'
import routes from './routes/index.js'
import {
  errorHandler,
  notFoundHandler,
} from './errors/middleware/errorHandler.js'

const app = express()

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (process.env.NODE_ENV === 'development') {
      callback(null, true)
      return
    }

    const frontendUrl = process.env.FRONTEND_URL
    const frontendUrlTest = process.env.FRONTEND_URL_TEST

    const allowedOrigins: string[] = []

    if (frontendUrl) {
      allowedOrigins.push(frontendUrl)
    }

    if (frontendUrlTest) {
      allowedOrigins.push(frontendUrlTest)
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(health)
app.use('/api', routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
