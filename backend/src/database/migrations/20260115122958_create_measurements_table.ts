import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('measurements', (table) => {
		table.uuid('id', { primaryKey: true })
		table
			.uuid('contract_id')
			.notNullable()
			.references('id')
			.inTable('contracts')
			.onDelete('RESTRICT')
		table.date('issue_date').notNullable()
		table.date('approval_date').nullable()
		table.string('approval_status').notNullable().defaultTo('PENDENTE')
		table.decimal('total_gross_value', 19, 2).notNullable()
		table.decimal('retention_value', 19, 2).notNullable().defaultTo(0)
		table.decimal('total_net_value', 19, 2).notNullable()
		table.string('notes').nullable()
		table.timestamps(true, true)
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('measurements')
}
