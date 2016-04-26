const redisKey = require('../config/redis-key')
const tools = require('../utils/tools')

const generateBaseInfoKey = (key) => {
  return `${redisKey.BASEINFO}#${key}`
}

const generateBaseInfo = (title) => {
  if (title.indexOf('.md') > 0) {
    title = title.substring(0, title.indexOf('.md') - 1)
  }
  const infos = title.split('#')
  const baseInfos = {}
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