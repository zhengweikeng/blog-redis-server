const redis = require('./utils/redis')
const posts = require('./lib/posts')

module.exports = app = () => {
  const redisClient = redis.client()
  posts.reloadBaseInfoFromGithub()
}

if (!module.parent) {
  app()
}