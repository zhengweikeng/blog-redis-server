const bunyan = require('bunyan')
const path = require('path')
const fs = require('fs')

const log =  bunyan.createLogger({
  name: 'blog_log',
  streams: [
    {
      level: 'info',
      path: path.resolve(__dirname, '../logs/redis.log'),
      type: 'rotating-file',
      period: '30d',
      count: 3
    },
    {
      level: 'error',
      path: path.resolve(__dirname, '../logs/'),
      type: 'rotating-file',
      period: '30d',
      count: 3
    }
  ]
})

function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers
  }
}

module.exports = log