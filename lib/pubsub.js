const redis = require('../utils/redis')
const redisKey = require('../config/redis-key')
const postInit = require('../lib/posts-init')

module.exports = () => {
  const redisClient = redis.createClient()
  redisClient.subscribe(redisKey.pubsub.RELOAD)
  
  redisClient.on('message', (channel, message) => {
    console.log("sub channel " + channel + ": " + message)
    postInit(true)
  }) 
}