import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('measurement_items', (table) => {
		table.uuid('id', { primaryKey: true })
		table
			.uuid('measurement_id')
			.notNullable()
			.references('id')
			.inTable('measurements')
			.onDelete('CASCADE')
		table
			.uuid('contract_item_id')
			.notNullable()
			.references('id')
			.inTable('contract_items')
			.onDelete('RESTRICT')
		table.decimal('quantity', 10, 2).notNullable()
		table.decimal('unit_labor_value', 19, 2).notNullable()
		table.decimal('total_gross_value', 19, 4).notNullable()
		table.timestamps(true, true)
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('measurement_items')
}
