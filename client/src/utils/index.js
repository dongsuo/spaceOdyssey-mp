export function fetch(data) {
  return wx.cloud.callFunction({
    name: 'proxy',
    data
  }).then(resp => {
    console.log(resp)
    if(resp.errMsg !== 'cloud.callFunction:ok' || resp.result.errorCode === 1) {
      Taro.showToast({
        title: '数据获取失败，请重试'
      })
    } else {
      return resp.result
    }
  })
}
