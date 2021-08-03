exports.up = (knex) =>
    knex.schema.createTable("Profile_Champion_Pool", (tbl) => {
        tbl.increments("id")
        tbl.string("champion", 128).unique().notNullable()
        tbl.integer("championPoints").notNullable()
        tbl.timestamps(true, true)
    })

exports.down = (knex) => knex.schema.dropTableIfExists("Profile_Champion_Pool")
