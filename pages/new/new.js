// pages/new/new.js

const app = getApp()
wx.cloud.init({ env: 'skate-city-0169ad' })
const db = wx.cloud.database()

Page({
  data: {
    filtered_styles:[],
    styles: [
      { name: 'Rails', value: 'Rails', checked: false },
      { name: 'Bowls', value: 'Bowls', checked: false },
      { name: 'Pools', value: 'Pools', checked: false },
      { name: 'Ramps', value: 'Ramps', checked: false},
      { name: 'Ledges', value: 'Ledges', checked: false},
      { name: 'Stairs', value: 'Stairs', checked: false },
      { name: 'Slopes', value: 'Slopes', checked: false },
      { name: 'Skateparks', value: 'Skatepark', checked: false },
    ]
  },


//------------------------Allows user to choose current location------------------------//
  userGetLocation: function (e) {
    wx.getLocation({
      type: 'gcj02', //Return can be used as the latitude and longitude of wx.openLocation
      success: function (res) {
        console.log("getLocation", res)
        var latitude = res.latitude
        console.log("latitude", latitude)
        var longitude = res.longitude
        console.log("longitude", longitude)
        // Use maps in WeChat to check location.
        // Requires user authorisation!!!! TO BE CHECKED
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },

//------------------------Allows user to choose a location------------------------//
  userChooseLocation: function (e) {
   // Cannot use the "this" command within success
    let that = this
    wx.chooseLocation({
      success: function (res) {
        // console.log("name", name)
        var address = res.address
        // console.log("address", address)
        var latitude = res.latitude
        // console.log("latitude", latitude)
        var longitude = res.longitude
        // console.log("longitude", longitude)
        that.setData({
          // Changing the address value to the one selected on the map.
          // This will then be saved in "spot" object, sent in POST request lower in this page.
          address: address
        })
      }
    })
  },





  //Checkboxes for Skate Type
  checkboxChange: function (e) {
    this.setData({
      filtered_styles: e.detail.value
    })
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    // let styles = this.data.styles.map((item) => {
    //   // indexOf checks for a name, and makes sure we're still in the array.
    //   // If index is -1 then it's not in the list, because index starts at 0.
    //   if (e.detail.value.indexOf(item.name) > -1) {
    //     item.checked = true
    //   }
    //   return item;
    // })
    // this.setData({
    //   styles: styles
    // })
    // console.log(this.data.styles)
    // let filtered_styles = this.data.styles.filter((item) => item.checked);
    // console.log(filtered_styles)
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
      title: 'Upload Successful!',
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
    console.log(e)
    var photo = this.data.fileID;
    var description = e.detail.value.description;
    var address = e.detail.value.address;
    // var styles = e.detail.value.styles.filter((item)=>item.checked).map((item) => item.name);
    let userInfo = app.globalData.userInfo
    let userId = app.globalData.userId

    let spot = {
      name: name,
      user_id: userId,
      description: description,
      location: address,
      styles: this.data.filtered_styles.join(', ')
    }
    this.postFormData(spot)
  },

  postFormData: function(spot) {
    console.log(spot);
    wx.request({
      url: app.globalData.host + 'api/v1/spots/',
      // url: 'http://localhost:3000/api/v1/spots/',

      method: 'POST',
      data: { spot },
      success(res) {
        console.log('post successful!', res)
        // set data on main & show
        wx.reLaunch({
          url: `/pages/show/show?id=${res.data.spot.id}`
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