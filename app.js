//app.js
const AV = require('./utils/av-weapp-min.js')
const config = require('./key')

AV.init({
  appId: config.appId,
  appKey: config.appSecret,
});

App({

  onLaunch: function () {
    // app.status = function () {
    //   console.log("status", globalData)
    // }
    // wx.cloud.init({
    //   env: '736f-sock-m-72589c'
    // })

    const host = this.globalData.host;

    console.log('processing to login')
    wx.login({
      success: (res) => {
        console.log(res)

        wx.request({
          url: host + 'login',
          method: 'post',
          data: {
            code: res.code
          },

          success: (res) => {
            console.log("login info", res)
            this.globalData.userId = res.data.userId
          }


        })

      }
    })
  },
  globalData: {
    host: "https://skatecity.wogengapp.cn/",
  //host: 'http://localhost:3000/',

    userId: null,
    userInfo: {}
  }

})