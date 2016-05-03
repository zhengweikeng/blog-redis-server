const cheerio = require('cheerio')
const remoteUrl = require('../config/remote-url')
const request = require('../utils/request')
const redis = require('../utils/redis')
const redisKey = require('../config/redis-key')
const tools = require('../utils/tools')
const redisTools = require('../utils/redis-tools')
const debug = require('debug')('posts:init')

const postsUrl = remoteUrl.posts

const parseYears = (html) => {
  debug('begin parseYears task...')
  const years = []
  const $ = cheerio.load(html)
  $('table.files tr').each((rowNum, row) => {
    if (rowNum > 1) {
      const $$ = cheerio.load($(row).html())
      years.push($$('.content a').text())
    }
  })
  return years
}

const parseTitles = (html) => {
  debug('begin parseTitles task...')
  const titles = []
  const $ = cheerio.load(html)
  $('.file-wrap table tr').each((rowNum, row) => {
    if (rowNum > 1) {
      const $$ = cheerio.load($(row).html())
      if (!$$('svg').attr('class').includes('directory')) {
        titles.push($$('.content a').text())
      }
    }
  })
  return titles
}

const parseBaseInfo = (titles) => {
  // { year1: {titlePinyin: {title: xxx},...}, year2: {titlePinyin: {title: xxx},...} }
  debug('begin parseBaseInfo task...')
  const baseInfos = {}
  
  Object.keys(titles).forEach((year) => {
    const titlesList = titles[year]
    const postInfoList = {}
    
    titlesList.forEach((title) => {
      const desc = redisTools.generateBaseInfo(title)
      const titleParsed = tools.chinese2pinyin(desc.title)
      postInfoList[titleParsed] = JSON.stringify(desc)
    })
    baseInfos[year] = postInfoList
  })
  
  return baseInfos
}

const saveBaseInfos = (baseInfos) => {
  debug('begin saveBaseInfos task...')
  const redisClient = redis.client()
  Object.keys(baseInfos).forEach((year) => {
    const saveInfo = baseInfos[year]
    redisClient.hmset(redisTools.generateBaseInfoKey(year), saveInfo)
  })
  return baseInfos
}

const saveTags = (baseInfos) => {
  debug('begin saveTags task...')
  const redisClient = redis.client()
  Object.keys(baseInfos).forEach((year) => {
    const infos = baseInfos[year]
    Object.keys(infos).forEach((key) => {
      try {
        const info = JSON.parse(infos[key])
        const tags = info.tag
        if (tags) {
          redisClient.sadd(redisKey.TAGS, ...tags)
        }
      } catch (error) {
        throw new Error(error)
      }
    })
  })
  return
}

const crawlPostsTitles = (years) => {
  debug('begin crawlPostsTitles task...')
  const requestPromises = years.map((year) => request.get(`${postsUrl}/${year}`))
  return Promise.all(requestPromises)
  .then((responses) => {
    const titlesObj = {}
    responses.forEach((res, i) => {
      const titles = parseTitles(res.text)
      titlesObj[years[i]] = titles
    })
    return titlesObj
  })
}

module.exports = () => {
  const redisClient = redis.client()
  const isClear = process.env.clear
  const init_pass = process.env.init_pass
  if (isClear) {
    redisClient.flushdb()
    debug('flush redis success')
  }
  
  if (!init_pass) {
    return request.get(postsUrl)
    .then((res) => parseYears(res.text))
    .then((years) => {
      years.forEach((year) => redisClient.sadd(redisKey.YEAR, year))
      return years
    })
    .then((years) => crawlPostsTitles(years))
    .then((titles) => parseBaseInfo(titles))
    .then((baseInfos) => saveBaseInfos(baseInfos))
    .then((baseInfos) => saveTags(baseInfos))
    .then(() => debug('redis initialization finish'))
    .catch((err) => console.log(err))
  }
  
}