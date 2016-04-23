const cheerio = require('cheerio')
const remoteUrl = require('../config/remote-url')
const request = require('../utils/request')
const redis = require('../utils/redis')
const redisKey = require('../config/redis-key')

const postsUrl = remoteUrl.posts

const parseYears = (html) => {
  console.log('begin parseYears task...')
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
  console.log('begin parseTitles task...')
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
  // { year1: [title: xxx], year2: [title: xxx] }
  console.log('begin parseBaseInfo task...')
  const baseInfos = {}
  
  Object.keys(titles).forEach((year) => {
    const titlesList = titles[year]
    const postInfoList = [] 
    
    titlesList.forEach((title) => {
      const baseInfo = title.split('#')
      const postInfo = {}
      baseInfo.forEach((info, i) => {
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
      postInfoList.push(postInfo)
    })
    baseInfos[year] = postInfoList
  })
  
  return baseInfos
}

const saveBaseInfos = (baseInfos) => {
  console.log('begin saveBaseInfos task...')
  const redisClient = redis.client()
  const saveInfo = {}
  Object.keys(baseInfos).forEach((year) => {
    const serializeBaseInfo = JSON.stringify(baseInfos[year])
    saveInfo[year] = serializeBaseInfo
  })
  console.log(saveInfo)
  redisClient.hmset(redisKey.BASEINFO, saveInfo)
}

const crawlPostsTitles = (years) => {
  console.log('begin crawlPostsTitles task...')
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

exports.reloadBaseInfoFromGithub = () => {
  const redisClient = redis.client()
  request.get(postsUrl)
  .then((res) => parseYears(res.text))
  .then((years) => {
    years.forEach((year) => redisClient.sadd(redisKey.YEAR, year))
    return years
  })
  .then((years) => crawlPostsTitles(years))
  .then((titles) => parseBaseInfo(titles))
  .then((baseInfo) => saveBaseInfos(baseInfo))
  .then(() => console.log('redis initialization finish'))
  .catch((err) => console.log(err))
}