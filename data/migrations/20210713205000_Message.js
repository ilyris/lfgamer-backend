
exports.up = (knex) =>
knex.schema.createTable("Message", (tbl) => {
    tbl.increments("id")
    tbl.integer("conversationId").notNullable().references("id").inTable("Conversation")
    tbl.integer("senderId").notNullable().references("id").inTable("User")
    tbl.boolean("read").notNullable(0)
    tbl.string('text', 500)
    // tbl.integer('unixTimestamp', new Date());
    tbl.timestamps(true, true)

})

exports.down = (knex) => knex.schema.dropTableIfExists("Message")
