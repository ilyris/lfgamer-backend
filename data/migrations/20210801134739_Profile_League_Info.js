exports.up = (knex) =>
    knex.schema.createTable("Profile_League_Info", (tbl) => {
        tbl.increments("id")
        tbl.string("queueType").notNullable()
        tbl.string("tier", 128).notNullable()
        tbl.string("rank",128).notNullable()
        tbl.string("summonerName", 128).notNullable()
        tbl.integer("wins").notNullable()
        tbl.integer("losses", 600).notNullable()
        tbl.timestamps(true, true)
    })

exports.down = (knex) => knex.schema.dropTableIfExists("Profile_League_Info")
