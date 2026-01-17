import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	return knex.schema.table('users', function (table) {
		table.renameColumn('type_user_id', 'user_type_id')
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.table('users', function (table) {
		table.renameColumn('user_type_id', 'type_user_id')
	})
}
