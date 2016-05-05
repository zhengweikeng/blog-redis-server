"use strict"
const redis = require('redis')
const redisConfig = require('../config/redis')

let client = null
module.exports = {
  client: () => {
    if (!client) {
      client = redis.createClient(redisConfig)
      client.on('connect', () => {
        console.log('redis connect success!')
      })
      client.on('error', (err) => {
        console.log(`error message: ${err}`)
        process.exit(1)
      })
    }
    return client
  },
  createClient() {
    return redis.createClient(redisConfig)
  }
}
