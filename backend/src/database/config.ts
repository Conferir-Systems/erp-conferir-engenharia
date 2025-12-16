import dotenv from 'dotenv'
import knexfile from './knexfile'

dotenv.config()

const environment = process.env.NODE_ENV || 'development'
const dbConfig = knexfile[environment as keyof typeof knexfile]

if (!dbConfig || !dbConfig.connection) {
  throw new Error(
    `No database configuration found for environment: ${environment}`
  )
}

const connection =
  typeof dbConfig.connection === 'function'
    ? dbConfig.connection()
    : dbConfig.connection

export const config = {
  environment,
  server: {
    port: Number(process.env.BACKEND_PORT) || 3000,
  },
  database: {
    host:
      typeof connection === 'object' && 'host' in connection
        ? connection.host
        : 'localhost',
    port:
      typeof connection === 'object' && 'port' in connection
        ? connection.port
        : 5432,
    database:
      typeof connection === 'object' && 'database' in connection
        ? connection.database
        : 'conf',
    user:
      typeof connection === 'object' && 'user' in connection
        ? connection.user
        : 'postgres',
  },
}
