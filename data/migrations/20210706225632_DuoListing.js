
exports.up = (knex) =>
knex.schema.createTable("DuoListing", (tbl) => {
    tbl.increments("id")
    tbl.integer("user_id").unique().notNullable().references("id").inTable("User")
    tbl.string("rank", 128).notNullable()
    tbl.specificType("champions", "text ARRAY").notNullable()
    tbl.specificType("roles", "text ARRAY").notNullable()
    tbl.boolean("mic").notNullable()
    tbl.string("post_description", 600).notNullable()
    tbl.timestamps(true, true)
})

exports.down = (knex) => knex.schema.dropTableIfExists("DuoListing")
