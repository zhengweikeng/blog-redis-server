const redisKey = require('../config/redis-key')
const tools = require('../utils/tools')

const generateBaseInfoKey = (key) => {
  return `${redisKey.BASEINFO}#${key}`
}

const getAttr = (title, delimiters) => {
  const start = title.indexOf(delimiters)
  const end = title.lastIndexOf(delimiters)
  if (start > 0 && end > 0 && end > start) {
    return title.substring(start + 1, end)
  }
  return null
}

const generateBaseInfo = (title) => {
  const baseInfos = {}
  if (title.lastIndexOf('.md') > 0) {
    title = title.substring(0, title.indexOf('.md'))
    baseInfos.ext = 'md'
  }
  
  let pureTitle = title
  
  const tags = getAttr(title, '#')
  if (tags) {
    baseInfos.tag = tags.split(',')
    const oriTag = `#${tags}#`
    pureTitle = pureTitle.replace(oriTag, '')
  }
  
  const postTime = getAttr(title, '$')
  if (postTime) {
    baseInfos.postTime = postTime
    const oriPostTime = `$${postTime}$`
    pureTitle = pureTitle.replace(oriPostTime, '')
  }
  
  baseInfos.title = pureTitle
  
  return baseInfos
}

module.exports = {
  generateBaseInfoKey,
  generateBaseInfo
}