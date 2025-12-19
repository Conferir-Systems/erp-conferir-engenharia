import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  return knex.schema.createTable('suppliers', (table) => {
    table.uuid('id', { primaryKey: true })
    table.enum('type_person', ['FISICA', 'JURIDICA']).notNullable()
    table.string('document').notNullable()
    table.string('pix')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('suppliers')
}
