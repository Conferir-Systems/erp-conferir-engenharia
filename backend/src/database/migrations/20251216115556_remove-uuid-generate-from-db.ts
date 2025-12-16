import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('ALTER TABLE users ALTER COLUMN id DROP DEFAULT')
  await knex.raw('ALTER TABLE user_types ALTER COLUMN id DROP DEFAULT')
  await knex.raw('ALTER TABLE works ALTER COLUMN id DROP DEFAULT')
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    'ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4()'
  )
  await knex.raw(
    'ALTER TABLE user_types ALTER COLUMN id SET DEFAULT uuid_generate_v4()'
  )
  await knex.raw(
    'ALTER TABLE works ALTER COLUMN id SET DEFAULT uuid_generate_v4()'
  )
}
