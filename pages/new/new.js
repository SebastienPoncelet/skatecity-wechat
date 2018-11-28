// pages/new/new.js

const app = getApp()
//const db = wx.cloud.database()
// Calling the av-weapp-min.js file which is Leancloud's SDK


Page({
  data: {
  },

  // Date Picker
  bindDateChange: function (e) {
    console.log('picker: date choosen', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //Choose Image Function

  takePhoto: function () {
    let that = this
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
            console.log("cloud id to store", that.data.fileID)
          },
          fail: console.error
        })
      }
    });
  },


  // New Machine Submission
  bindSubmit: function (e) {
    this.setData({
      loading: !this.data.loading
    });

    wx.showToast({
      title: 'Sending...',
      icon: 'loading',
      duration: 1500
    });



    var name = e.detail.value.name;
    // var image = e.detail.value.image;
    var photo = this.data.fileID;
    console.log("store in photo variable", photo);
    var description = e.detail.value.description;
    var address = e.detail.value.address;
    var rating = e.detail.value.rating;
    var typee = e.detail.value.type;
    var availability = e.detail.value.availability

    let userInfo = app.globalData.userInfo
    let userId = app.globalData.userId
    console.log("userInfo", userInfo)
    console.log(availability)

    let skatespot = {
      "name": name,
      user_id: userId,
      // "image": image,
      "photo": photo,
      "description": description,
      "location": address,
      "rating": rating,
      "type": type,
      "availability": availability
    }

    console.log("skatespot", skatespot)
    // Get api data
    wx.request({
      url: `http://local:3000/api/v1/spots`,
      method: 'POST',
      data: { skatespot },
      success(res) {
        console.log(res)
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