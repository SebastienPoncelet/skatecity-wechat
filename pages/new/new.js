// pages/new/new.js

const app = getApp()
wx.cloud.init({ env: 'skate-city-0169ad' })
const db = wx.cloud.database()


Page({
  data: {
    styles: [
      { name: 'Skateparks', value: 'Skateparks' },
      { name: 'Pyramids', value: 'Pyramids' },
      { name: 'Rails', value: 'Rails' },
      { name: 'Bowls', value: 'Bowls' },
      { name: 'Pools', value: 'Pools' },
      { name: 'Ramps', value: 'Ramps' },
      { name: 'Slopes', value: 'Slopes' },
      { name: 'Ledges', value: 'Ledges' },
      { name: 'Stairs', value: 'Stairs' },
    ]
  },

  //Checkboxes for Skate Type
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  //Choose Image Function

  takePhoto: function () {
    let that = this
    wx.showLoading()
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("log res from take photo", res)
        var photoPath = res.tempFilePaths[0]
        console.log("log tempPath", photoPath)
        wx.cloud.uploadFile({
          cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}`,
          filePath: photoPath,
          success: res => {
            console.log("success", res)
            that.setData({
              fileID: res.fileID
            });
            that.showSuccessModal()
            console.log("cloud id to store", that.data.fileID)
          },
          fail: console.error
        })
      }
    });
  },

  // New Skate Spot Submission
  bindSubmit: function (e) {
    this.storeFormData(e)
    this.setData({
      loading: !this.data.loading
    })
  }, 

  showSuccessModal: function() {
    wx.hideLoading()
    wx.showToast({
      title: 'Upload Success!',
      icon: 'success'
    })
  },

    // wx.showToast({
    //   title: 'Creating...',
    //   icon: 'loading',
    //   duration: 1500
    // });

  storeFormData: function(e) {
    var name = e.detail.value.name;
    var photo = this.data.fileID;
    var description = e.detail.value.description;
    var address = e.detail.value.address;
    var style = e.detail.value.type;
    let userInfo = app.globalData.userInfo
    let userId = app.globalData.userId

    let skatespot = {
      name: name,
      user_id: userId,
      description: description,
      location: address,
      style: style
    }
    this.postFormData(skatespot)
  },

  postFormData: function(skatespot) {
    wx.request({
      url: `http://local:3000/api/v1/spots`,
      method: 'POST',
      data: { skatespot },
      success(res) {
        console.log('post successful!', res)
        // set data on main & show
        wx.reLaunch({
          url: '/pages/show/show'
        });
      }
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },




})