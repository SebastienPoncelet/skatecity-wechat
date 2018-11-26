// pages/landing/landing.js
const app = getApp()

Page({
  goSpots() {
    console.log("goSpots globalData", app.globalData)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    let userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo
    this.setData({
      userInfo: userInfo
    })
    wx.navigateTo({
      url: '/pages/index/index',
    })



    // wx.setStorage({
    //   key: 'userInfo',
    //   data: userInfo,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },

  // Implementing Leancloud upload from camera
})
