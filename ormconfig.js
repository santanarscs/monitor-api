require('dotenv/config')

const devConfig =  [
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
    name: 'mongo',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'monitor',
    useUnifiedTopology: true,
    entities: [
      './dist/modules/**/infra/typeorm/schemas/*.js'
    ]
  }
]

module.exports = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;