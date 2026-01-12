import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('contract_items', (table) => {
		table.uuid('id', { primaryKey: true })
		table
			.uuid('contract')
			.notNullable()
			.references('id')
			.inTable('contracts')
			.onDelete('CASCADE')
		table.string('unit_measure').notNullable()
		table.decimal('quantity', 19, 4).notNullable()
		table.decimal('unit_labor_value', 19, 4).notNullable()
		table.string('description').notNullable()
		table.timestamps(true, true)
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('contract_items')
}
