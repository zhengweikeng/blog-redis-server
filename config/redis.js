const redisPassword = process.env.redis_pass || ''
const config = {
  development: {
    host: '127.0.0.1',
    port: 6379
  },
  production: {
    host: process.env.REDIS_PORT_6379_TCP_ADDR,
    port: process.env.REDIS_PORT_6379_TCP_PORT,
    password: process.env.REDIS_PASSWORD
  }
}

const env = process.env.NODE_ENV
module.exports = config[env]