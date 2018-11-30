//app.js
wx.cloud.init()
const db = wx.cloud.database()

App({

  onLaunch: function () {
    // app.status = function () {
    //   console.log("status", globalData)
    // }
    wx.cloud.init({
      env: '736f-sock-m-72589c'
    })

    const host = 'http://skatecity.wogengapp.cn/'
    // const host = 'http://localhost:3000/'
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
    host: "http://skatecity.wogengapp.cn/",
    // host: 'http://localhost:3000/',
    userId: null,
    userInfo: {}
  }

})