import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract_items', (table) => {
    table.dropForeign(['contract'])

    table
      .foreign('contract')
      .references('id')
      .inTable('contracts')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract_items', (table) => {
    table.dropForeign(['contract'])

    table
      .foreign('contract')
      .references('id')
      .inTable('contracts')
      .onDelete('RESTRICT')
  })
}
