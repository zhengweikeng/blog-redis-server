const redisKey = require('../config/redis-key')
const tools = require('../utils/tools')

const generateBaseInfoKey = (key) => {
  return `${redisKey.BASEINFO}#${key}`
}

const generateBaseInfo = (title) => {
  const baseInfos = {}
  if (title.lastIndexOf('.md') > 0) {
    title = title.substring(0, title.indexOf('.md'))
    baseInfos.ext = 'md'
  }
  const infos = title.split('#')
  infos.forEach((info, i) => {
    if (i === 0) {
      baseInfos.title = info
    }
    if (i === 1) {
      baseInfos.tag = info.split(',')
    }
    if (i === 2) {
      baseInfos.postTime = info
    }
  })
  
  return baseInfos
}

module.exports = {
  generateBaseInfoKey,
  generateBaseInfo
}