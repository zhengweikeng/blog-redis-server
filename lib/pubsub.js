const _ = require('lodash')
const redisClient = require('../utils/redis').client
const redisKey = require('../config/redis-key')

const yearChannel = (channel, msg) => {
  if (channel === 'year:add') {
    redisClient.sadd(redisKey.YEAR, msg)
  }
  if (channel === 'year:del') {
    redisClient.srem(redisKey.YEAR, msg)
  }
  if (channel === 'year:update') {
    redisClient.srem(redisKey.YEAR, msg.oldVal)
    redisClient.sadd(redisKey.YEAR, msg.newVal)
  }
}

const addPostsInfo = (msg) => {
  redisClient.hget(redisKey.BASEINFO, (err, baseInfos) => {
    const year = msg.year
    baseInfos = JSON.parse(baseInfos)[year]
    const title = msg.title
    const infos = title.split('#')
    const postInfo = {}
    infos.forEach((info, i) => {
      if (i === 0) {
        postInfo.title = info
      }
      if (i === 1) {
        postInfo.postTime = info
      }
      if (i === 2) {
        postInfo.tag = info
      }
    })
    baseInfos.push(postInfo)
    const serializeBaseInfo = JSON.stringify(baseInfos)
    redisClient.hset(redisKey.BASEINFO, msg.year, serializeBaseInfo)
  })
}

const delPostInfo = (msg) => {
  
}

const baseInfoChannel = (channel, msg) => {
  if (channel === 'baseInfo:add') {
    addPostsInfo(msg)
  }
  if (channel === 'baseInfo:del') {
    delPostInfo(msg)
  }
}

redisClient.on('pmessage', (pattern, channel, msg) => {
  switch (pattern) {
    case patterns[0]:
      yearChannel(channel, msg)
      break;
    case patterns[1]:
      baseInfoChannel(channel)
      break;
    default:
      console.log('do nothing')
      break;
  }
})

module.export = () => {
  const patterns = ['year:*', 'baseInfo:*']
  redisClient.psubscribe(patterns, (err, res) => {
    if (err) {
      return console.log(err)
    }
  }) 
}