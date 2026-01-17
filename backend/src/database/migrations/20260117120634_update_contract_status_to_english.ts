import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.raw(
		'ALTER TABLE contracts ALTER COLUMN status TYPE varchar(20) USING status::varchar'
	)

	await knex.raw(
		'ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_status_check'
	)

	await knex.raw(
		"UPDATE contracts SET status = 'Active' WHERE status = 'Ativo'"
	)
	await knex.raw(
		"UPDATE contracts SET status = 'Completed' WHERE status = 'Concluído'"
	)

	await knex.raw(
		"ALTER TABLE contracts ADD CONSTRAINT contracts_status_check CHECK (status IN ('Active', 'Completed'))"
	)

	await knex.raw(
		"ALTER TABLE contracts ALTER COLUMN status SET DEFAULT 'Active'"
	)
}

export async function down(knex: Knex): Promise<void> {
	await knex.raw(
		'ALTER TABLE contracts ALTER COLUMN status TYPE varchar(20) USING status::varchar'
	)

	await knex.raw(
		'ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_status_check'
	)

	await knex.raw(
		"UPDATE contracts SET status = 'Ativo' WHERE status = 'Active'"
	)
	await knex.raw(
		"UPDATE contracts SET status = 'Concluído' WHERE status = 'Completed'"
	)

	await knex.raw(
		"ALTER TABLE contracts ADD CONSTRAINT contracts_status_check CHECK (status IN ('Ativo', 'Concluído'))"
	)
	await knex.raw(
		"ALTER TABLE contracts ALTER COLUMN status SET DEFAULT 'Ativo'"
	)
}
