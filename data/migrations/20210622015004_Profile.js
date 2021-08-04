exports.up = (knex) =>
    knex.schema.createTable("Profile", (tbl) => {
        tbl.increments("id")
        tbl.integer("user_id").unique().notNullable().references("id").inTable("User")
        tbl.integer("riot_id").unique().notNullable().references("id").inTable("Profile_League_Account_Info")
        tbl.string("rank", 128).notNullable()
        tbl.specificType("champions", "text ARRAY").notNullable()
        tbl.specificType("roles", "text ARRAY").notNullable()
        tbl.boolean("mic").notNullable()
        tbl.string("about_me", 600).notNullable()
        tbl.timestamps(true, true)
    })

exports.down = (knex) => knex.schema.dropTableIfExists("Profile")
