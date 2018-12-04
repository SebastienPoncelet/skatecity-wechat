// pages/new/new.js

const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

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
    ],
    photo_url: ''
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

  /* Create Button */
  goCreate: function () {
    wx.navigateTo({
      url: '../new/new'
    });
  },

  /* Home Button */
  goHome: function () {
    wx.navigateTo({
      url: '../index/index'
    });
  },

  //Checkboxes for Skate Type
  checkboxChange: function (e) {
    this.setData({
      filtered_styles: e.detail.value
    })
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
      spot: {
        name: name,
        user_id: userId,
        description: description,
        address: address,
        styles: this.data.filtered_styles.join(', ')
      },
      image: {
        //add variable from image save below
        url: this.data.photo_url
      }
    }
    this.postFormData(spot)
  },

  postFormData: function(spot) {
    console.log(spot);
    wx.request({
      url: app.globalData.host + 'api/v1/spots/',
      // url: 'http://localhost:3000/api/v1/spots/',

      method: 'POST',
      data: spot,
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

  //Choose Image Function, add variable after saving the photo, then add to url above
  takePhoto: function () {
    const that = this;
    wx.chooseImage({
      count: 8,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            that.setData({
              photo_url: file.attributes.url
            })
          }
        ).catch(console.error);
      }
    });
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