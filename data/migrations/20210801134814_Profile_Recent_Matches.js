exports.up = (knex) =>
    knex.schema.createTable("Profile_Recent_Matches", (tbl) => {
        tbl.increments("id")
        tbl.integer("gameId").unique().notNullable()
        tbl.string("lane", 128).notNullable()
        tbl.string("champion",128).unique().notNullable().references("champion").inTable("Profile_Champion_Pool")
        tbl.boolean("win").notNullable()
        tbl.timestamps(true, true)
    })

exports.down = (knex) => knex.schema.dropTableIfExists("Profile_Recent_Matches")
