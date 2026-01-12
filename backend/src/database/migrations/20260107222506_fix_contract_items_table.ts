import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('contract_items', (table) => {
		table.dropForeign(['contract'])

		table.decimal('quantity', 10, 2).notNullable().alter()
		table.decimal('unit_labor_value', 10, 4).notNullable().alter()

		table
			.foreign('contract')
			.references('id')
			.inTable('contracts')
			.onDelete('RESTRICT')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('contract_items', (table) => {
		table.dropForeign(['contract'])

		table.decimal('quantity', 19, 4).notNullable().alter()
		table.decimal('unit_labor_value', 19, 4).notNullable().alter()

		table
			.foreign('contract')
			.references('id')
			.inTable('contracts')
			.onDelete('CASCADE')
	})
}
