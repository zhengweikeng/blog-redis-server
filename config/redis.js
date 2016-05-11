const config = {
  development: {
    host: '127.0.0.1',
    port: 6379
  },
  production: {
    host: '115.28.176.80',
    port: 6379
  }
}

const env = process.env.NODE_ENV
module.exports = config[env]