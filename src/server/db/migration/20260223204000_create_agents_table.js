/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('agents', function (table) {
    table.bigIncrements('id').primary()
    table.string('uid')
    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()
    table.unique(['uid'], { indexName: 'index_agents_on_uid' })
  })
}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('agents')
}
