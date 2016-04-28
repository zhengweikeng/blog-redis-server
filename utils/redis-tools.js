const redisKey = require('../config/redis-key')
const tools = require('../utils/tools')

const generateBaseInfoKey = (key) => {
  return `${redisKey.BASEINFO}#${key}`
}

const generateBaseInfo = (title) => {
  const baseInfos = {}
  if (title.indexOf('.md') > 0) {
    title = title.substring(0, title.indexOf('.md') - 1)
    baseInfos.ext = 'md'
  }
  const infos = title.split('#')
  infos.forEach((info, i) => {
    if (i === 0) {
      baseInfos.title = info
    }
    if (i === 1) {
      baseInfos.postTime = info
    }
    if (i === 2) {
      baseInfos.tag = info
    }
  })
  return baseInfos
}

module.exports = {
  generateBaseInfoKey,
  generateBaseInfo
}