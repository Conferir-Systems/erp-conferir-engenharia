import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  return knex.schema.table('users', function (table) {
    table
      .uuid('type_user_id')
      .unsigned()
      .references('id')
      .inTable('user_types')
      .onDelete('RESTRICT')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.dropColumn('type_user_id')
  })
}
