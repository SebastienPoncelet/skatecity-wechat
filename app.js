//app.js

App({

  onLaunch: function () {
    // app.status = function () {
    //   console.log("status", globalData)
    // }
    wx.cloud.init({
      env: '736f-sock-m-72589c'
    })

    const host = 'http://skate_city.wogengapp.cn/api/v1/spots/'
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
    host: "http://skate_city.wogengapp.cn/api/v1/spots"
    // host: ""
  }

})