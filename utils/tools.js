const crypto = require('crypto')
const pinyin = require('pinyin')

const md5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex')
}

const chinese2pinyin = (chineseText) => {
  const pinyins = pinyin(chineseText, {style: pinyin.STYLE_NORMAL})
  return pinyins.reduce((prev, next) => (prev+next[0]).toString(), '')
}


module.exports = {
  md5,
  chinese2pinyin
}