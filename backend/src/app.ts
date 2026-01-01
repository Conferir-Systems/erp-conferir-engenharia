import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import express from 'express'
import cors from 'cors'
// import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes'
import { errorHandler, notFoundHandler } from './errors/middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://.localhost:5173',
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
