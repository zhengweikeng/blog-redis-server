const redis = require('./utils/redis')
const postsInit = require('./lib/posts-init')

module.exports = app = () => {
  const redisClient = redis.client()
  postsInit()
}

if (!module.parent) {
  app()
}