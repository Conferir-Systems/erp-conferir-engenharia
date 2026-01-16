import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('contracts', (table) => {
		table.string('approval_status', 20).notNullable().defaultTo('Pendente')
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('contracts', (table) => {
		table.dropColumn('approval_status')
	})
}
