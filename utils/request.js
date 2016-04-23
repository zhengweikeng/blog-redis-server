const request = require('superagent')

exports.get = (url, params)=> {
  return new Promise((resolve, reject) =>{
    request.get(url)
    .query(params)
    .end((err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })
}

exports.post = (url, params)=> {
 return new Promise((resolve, reject) =>{
   request.post(url)
   .send(params)
   .end((err, res) => {
     if (err) {
       return reject(err)
     }
     return resolve(res)
   })
 })
}