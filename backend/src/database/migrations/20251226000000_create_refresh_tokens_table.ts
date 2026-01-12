import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('refresh_tokens', (table) => {
		table.uuid('id').primary()
		table
			.uuid('user_id')
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
		table.text('token').notNullable().unique()
		table.timestamp('expires_at').notNullable()
		table.timestamp('created_at').notNullable()
		table.timestamp('revoked_at').nullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('refresh_tokens')
}
