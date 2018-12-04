// pages/show/show.js
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    // bannerImages: ['https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
    autoplay: false,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
  scrollInto: 0,
    scrollList: [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '1' },
      { id: '2' }],
    tabs: ["Map", "More photos"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },


  scrollLeft: function (e) {
    var into = this.data.scrollInto;
    var length = this.data.scrollList.length;
    if (into > 0) {
      this.setData({
        scrollInto: into - 1,
      })
    } else {
      this.setData({
        scrollInto: length - 3,
      })
    }
  },
  scrollRight: function (e) {
    var into = this.data.scrollInto;
    if (into < this.data.scrollList.length - 3) {
      this.setData({
        scrollInto: into + 1,
      })
    } else {
      this.setData({
        scrollInto: 0,
      })
    }
  },

  /*  Uploading Photos */

  takePhoto: function () {
    const that = this;
    wx.chooseImage({
      count: 4,
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


  /* Send Rating */
    sendRating: function () {
      // console.log(this.data.spot);
      const options = this.data.options
      console.log("Options", options)
      const spotId = options.id
      const userId = app.globalData.userId
      console.log("User ID", userId)
      wx.request({
        url: app.globalData.host + 'api/v1/spots/' + options.id,
        // url: 'http://localhost:3000/api/v1/spots/' + options.id,

        method: 'PUT',
        data: { user_id: userId, id: parseInt(spotId) },
        // console.log("DATA", data),
        success(res) {
          console.log("Rating Sent", res)
          console.log("log spotId :", spotId)
          const data = spotId
          wx.hideToast();
          wx.reLaunch({
            url: `../show/show?id=${data}`
          })
        }
        

      });

  },
  /* Create Button */
  goCreate: function () {
    wx.switchTab({
      url: '../new/new'
    });
  },

  /* Share Function */
  onShareAppMessage: function () {
    return {
      title: 'Skate City | Go Skate',
      path: 'pages/show/show'
    }
  },

  onShareAppMessage: function () {
    console.log('share')
    wx.showShareMenu({
      withShareTicket: true
    })

    spot: { }

  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("OPTIONS",options)
    // console.log("AppGlobalData", app.globalData.userId)
    let page = this
    this.setData({options: options})
    wx.request({
      url: app.globalData.host + 'api/v1/spots/' + options.id,
      // url: 'http://localhost:3000/api/v1/spots/'+ options.id,
      method: 'GET',
      success(res) {
        console.log("Data received", res)
        const spot = res.data.spot;
        // Update local data
        const markers = [{
          id: spot.id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          name: spot.name
        }]
        page.setData({
          spot: spot,
          markers: markers,
          latitude: spot.latitude,
          longitude: spot.longitude
        });
        wx.hideToast();

      }

    });

  // map and more photos tab bar 
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

  },


  mapScroll() {
    wx.pageScrollTo({
      scrollTop: 500,
      duration: 300
    })
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
    console.log("OPTIONS On show", options)
    // console.log("AppGlobalData", app.globalData.userId)
    let page = this
    this.setData({ options: options })
    wx.request({
      url: app.globalData.host + 'api/v1/spots/' + options.id,
      // url: 'http://localhost:3000/api/v1/spots/'+ options.id,
      method: 'GET',
      success(res) {
        console.log("Data received", res)
        const spot = res.data.spot;
        // Update local data
        const markers = [{
          id: spot.id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          name: spot.name
        }]
        page.setData({
          spot: spot,
          markers: markers,
          latitude: spot.latitude,
          longitude: spot.longitude
        });
        wx.hideToast();

      }

    });
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



  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
      // wx.openLocation({
      //   latitude: this.data.latitude,
      //   longitude: this.data.longitude,
      //   scale: 28
      // })
  },

  //------------Getting spot's location------------//
  getCenterLocation: function () {
    let that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        // Assigning spot's longitude/latitude that were saved in this page global data in the GET request.
        res.longitude = that.data.longitude
        res.latitude = that.data.latitude
      }
    })
  },

  //------------Centering map on spot's location------------//
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  // translateMarker: function () {
  //   this.mapCtx.translateMarker({
  //     markerId: 1,
  //     autoRotate: true,
  //     duration: 1000,
  //     destination: {
  //       latitude: 23.10229,
  //       longitude: 113.3345211,
  //     },
  //     animationEnd() {
  //       console.log('animation end')
  //     }
  //   })
  // },
  // includePoints: function () {
  //   this.mapCtx.includePoints({
  //     padding: [10],
  //     points: [{
  //       latitude: 23.10229,
  //       longitude: 113.3345211,
  //     }, {
  //       latitude: 23.00229,
  //       longitude: 113.3345211,
  //     }]
  //   })
  // },



})