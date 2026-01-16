import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('works', (table) => {
		table.string('name', 60).alter()
		table.string('contractor', 50).alter()
		table.string('address', 255).alter()
	})

	await knex.schema.alterTable('contracts', (table) => {
		table.string('service', 255).alter()
	})

	await knex.schema.alterTable('suppliers', (table) => {
		table.string('name', 60).alter()
		table.string('document', 14).alter()
		table.string('pix', 80).alter()
	})

	await knex.schema.alterTable('contract_items', (table) => {
		table.string('unit_measure', 5).alter()
		table.string('description', 255).alter()
	})

	await knex.schema.alterTable('measurements', (table) => {
		table.string('notes', 255).alter()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('works', (table) => {
		table.string('name').alter()
		table.string('contractor').alter()
		table.string('address').alter()
	})

	await knex.schema.alterTable('contracts', (table) => {
		table.string('service').alter()
	})

	await knex.schema.alterTable('suppliers', (table) => {
		table.string('name').alter()
		table.string('document').alter()
		table.string('pix').alter()
	})

	await knex.schema.alterTable('contract_items', (table) => {
		table.string('unit_measure').alter()
		table.string('description').alter()
	})

	await knex.schema.alterTable('measurements', (table) => {
		table.string('notes').alter()
	})
}
