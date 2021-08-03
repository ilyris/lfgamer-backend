exports.up = (knex) =>
    knex.schema.createTable("User", (tbl) => {
        tbl.increments("id").primary()
        tbl.string("discord_id", 128).notNullable().unique()
        tbl.string("email", 128).notNullable().unique()
        tbl.string("username", 128).notNullable()
        tbl.string("discriminator", 128).notNullable().unique()
        tbl.string("avatar", 128).notNullable()
        tbl.string("hash", 128).notNullable().unique()
        tbl.timestamps(true, true)
    })

exports.down = (knex) => knex.schema.dropTableIfExists("User")
