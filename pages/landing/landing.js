// pages/landing/landing.js
const app = getApp()

Page({
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
  },
})
