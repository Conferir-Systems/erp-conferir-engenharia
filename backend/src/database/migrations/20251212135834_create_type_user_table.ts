import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

	return knex.schema.createTable('user_types', (table) => {
		table
			.uuid('id', { primaryKey: true })
			.defaultTo(knex.raw('uuid_generate_v4()'))
		table.string('name').notNullable().unique()
		table.timestamps(true, true)
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('user_types')
}
