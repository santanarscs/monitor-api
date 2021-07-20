require('dotenv/config')


const devConfig =  [
  {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_NAME,
    entities: ["./src/modules/**/infra/typeorm/entities/*.ts"],
    migrations: ["./src/database/migrations/*.ts"],
    cli: {
      "migrationsDir": "./src/database/migrations"
    }
  },
  {
    name: 'mongo',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'monitor',
    useUnifiedTopology: true,
    entities: [
      './src/modules/**/infra/typeorm/schemas/*.ts'
    ]
  }
]


const prodConfig = [
  {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 65433,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_NAME,
    entities: ["./dist/modules/**/infra/typeorm/entities/*.js"],
    migrations: ["./dist/database/migrations/*.js"],
    cli: {
      "migrationsDir": "./dist/database/migrations"
    }
  }
]

module.exports = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;