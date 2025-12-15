import type { Knex } from 'knex'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'conf',
      port: Number(process.env.DB_PORT) || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds'),
    },
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_TEST_HOST || 'localhost',
      user: process.env.DB_TEST_USER || 'postgres',
      password: process.env.DB_TEST_PASSWORD || 'postgres',
      database: process.env.DB_TEST_NAME || 'conf_test',
      port: Number(process.env.DB_TEST_PORT) || 5432,
    },
    pool: {
      min: 1,
      max: 5,
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds/test'),
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds'),
    },
  },
}

export default config
