import knex from 'knex'
import knexfile from './knexfile.js'
import { config as knexConfig } from './knex.config.js'

const environment = process.env.NODE_ENV || 'development'
const config = knexfile[environment]

if (!config) {
	throw new Error(
		`No database configuration found for environment: ${environment}`
	)
}

export const db = knex({ ...config, ...knexConfig })
