exports.up = (knex) =>
    knex.schema.createTable("Profile_League_Account_Info", (tbl) => {
        tbl.increments("id")
        tbl.integer("user_id").unique().notNullable().references("id").inTable("User")
        tbl.string("summonerId", 255).notNullable()
        tbl.string("accountId", 255).notNullable()
        tbl.timestamps(true, true)
    })

exports.down = (knex) => knex.schema.dropTableIfExists("Profile_League_Account_Info")
