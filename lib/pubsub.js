const _ = require('lodash')
const redisClient = require('../utils/redis').client
const redisKey = require('../config/redis-key')
const redisTools = require('../utils/redis-tools')
const tools = require('../utils/tools')

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
  const year = msg.year
  const postInfo = redisTools.generateBaseInfo(msg.title)
  var titleParsed = tools.chinese2pinyin(postInfo.title)
  const key = redisTools.generateBaseInfoKey(year)
  redisClient.hset(key, titleParsed, JSON.stringify(postInfo))
}

const delPostInfo = (msg) => {
  const year = msg.year
  const postInfo = redisTools.generateBaseInfo(msg.title)
  var titleParsed = tools.chinese2pinyin(postInfo.title)
  const key = redisTools.generateBaseInfoKey(year)
  redisClient.hdel(key, titleParsed)
}

const updatePostInfo = () => {
  const oldPost = {year: msg.year, title: msg.oldTitle}
  delPostInfo(oldPost)
  const newPost = {year: msg.year, title: msg.newTitle}
  addPostsInfo(newPost)
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