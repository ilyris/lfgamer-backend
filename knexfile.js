require("dotenv").config()

module.exports = {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./data/migrations"
        },
        seeds: {
            directory: "./data/seeds/dev"
        }
    },

    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: "./data/migrations",
            tableName: "knex_migrations"
        },
        seeds: { directory: "./data/seeds/production" }
    }
}
