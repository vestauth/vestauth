/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('public_jwks', function (table) {
    table.bigIncrements('id').primary()
    table.bigInteger('agent_id').notNullable()
    table.string('kid').notNullable()
    table.jsonb('value').notNullable().defaultTo({})
    table.string('state').notNullable().defaultTo('active')
    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()

    table.index(['agent_id'], 'index_public_jwks_on_agent_id')
    table.unique(['kid'], { indexName: 'index_public_jwks_on_kid' })
    table.foreign('agent_id').references('agents.id')
  })
}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('public_jwks')
}
