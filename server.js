const redis = require('./utils/redis')
const postsInit = require('./lib/posts-init')
const pubsub = require('./lib/pubsub')

module.exports = app = () => {
  const redisClient = redis.client()
  
  const isClear = process.env.clear
  const init_pass = process.env.init_pass
  postsInit(isClear, init_pass)
  .then(() => {
    pubsub()
  })
}

if (!module.parent) {
  app()
}