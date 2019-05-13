// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request');

cloud.init()

// 云函数入口函数
exports.main = async (event, ctx) => {
  // console.log(event)
  // console.log(context)
  const requestUrl = event.url
  let query = ''
  Object.keys(event).filter(key => {
    return key !== 'url' && key !=='userInfo'
  }).map((key,index) => {
    if(index===0) {
      query += `${key}=${event[key]}`
    } else {
      query += `&${key}=${event[key]}`
    }
  })
  const url = `${requestUrl}?${query}`
  console.log(url)
  const response = await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      let resp
      try {
        resp = JSON.parse(body)
      } catch (error) {
        resp = body
      }
      resolve(resp)
      // Do stuff with response
    });
  })
  return response
}
