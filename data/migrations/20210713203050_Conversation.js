
exports.up = (knex) =>
knex.schema.createTable("Conversation", (tbl) => {
    tbl.increments("id")
    tbl.integer("senderId").notNullable().references("id").inTable("User")
    tbl.integer("receiverId").notNullable().references("id").inTable("User")
    tbl.specificType("members", "int ARRAY").notNullable()
    tbl.timestamps(true, true)

})

exports.down = (knex) => knex.schema.dropTableIfExists("Conversation")
