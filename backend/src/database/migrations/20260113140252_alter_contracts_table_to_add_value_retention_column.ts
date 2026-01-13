import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('contracts', (table) => {
		table.decimal('retention_percentage', 5, 2).notNullable().defaultTo(0)
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('contracts', (table) => {
		table.dropColumn('retention_percentage')
	})
}
