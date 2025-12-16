import knex from 'knex'
import knexfile from './knexfile'

const environment = process.env.NODE_ENV || 'development'
const config = knexfile[environment as keyof typeof knexfile]

if (!config) {
  throw new Error(
    `No database configuration found for environment: ${environment}`
  )
}

export const db = knex(config)
