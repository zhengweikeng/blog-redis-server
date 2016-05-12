const redis = require('./utils/redis')
const postsInit = require('./lib/posts-init')
const pubsub = require('./lib/pubsub')

module.exports = app = () => {
  const redisClient = redis.client()
  
  const isClear = process.env.clear
  const init_pass = process.env.init_pass
  
  // redis数据初始化
  postsInit(isClear, init_pass)
  .then(() => {
    // 监听github事件
    pubsub()
  })
}

if (!module.parent) {
  app()
}