// TEST CHANGE



// pages/show/show.js
const app = getApp()
const AV = require('../../utils/av-weapp-min.js');
Page({

  //------------Setting up global data for this page------------//
  data: {
    // bannerImages: ['https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
    autoplay: false,

   //------------Map - Adding marker to the map------------//
   // Initialize "marker" as an empty array to then be able to fill it out with hashes with each spot id+longitude+latitude+address
    latitude: null,
    longitude: null,
    marker: [{}],//Empty hash as a show page only has one marker because it corresponds to only one spot

  scrollInto: 0,
    // scrollList: [
    //   { id: '1' },
    //   { id: '2' },
    //   { id: '3' },
    //   { id: '1' },
    //   { id: '2' },
    //   { id: '3' },
    //   { id: '4' },
    //   { id: '1' },
    //   { id: '2' }],
    tabs: ["More Photos", "Videos"],
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

  //----Uploading Photos----//
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
            wx.request({
              url: app.globalData.host + 'api/v1/images/',
              method: 'POST',
              data: { user_id: app.globalData.userId, spot_id: that.data.spot.id, url: file.attributes.url},
              success(res) {
                console.log(res)
                wx.reLaunch({
                  url: `../show/show?id=${res.data.spot_id}`
                })
              }
            });
          }
        ).catch(console.error);
      }
    });
  },

  //----Send Rating----//
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

  //------------FIXED TAB BAR AT THE BOTTOM------------//
  //----Create Button----//
  goCreate: function () {
    wx.navigateTo({
      url: '../new/new'
    });
  },

  //----Home Button----//
  goHome: function () {
    wx.navigateTo({
      url: '../index/index'
    });
  },

  //----Share Function----//
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
  openImage: function () {
    console.log('running');
    wx.previewImage({
      current: 'http://115.28.2.176/skate/1.jpg',
      urls: ['http://115.28.2.176/skate/3.jpg', 'http://115.28.2.176/skate/4.jpg']
    })
  },

  //------------Lifecycle function--Called when page load------------//
  onLoad: function (options) {
    this.setData({activespots: app.globalData['activespots']})
    // console.log('DATA', this.data)
    // console.log('ACTIVESPOTS', this.data.activespots)
    // console.log("OPTIONS",options)
    // console.log("AppGlobalData", app.globalData.userId)
    let that = this
    this.setData({options: options})
    wx.request({
      url: app.globalData.host + 'api/v1/spots/' + options.id,
      method: 'GET',
      success(res) {
        console.log("Data received", res)
        const spot = res.data.spot;
        // Update local data
        let markers = []
        const marker = {
          iconPath: '/assets/pin.png',
          width: 30,
          height: 30,
          id: spot.id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          name: spot.name
        }
        markers.push(marker)
        let user_images = [];
        let customer_images = [];
        spot.images.forEach((item) => {
          if (item.user_id == spot.user_id) {
            user_images.push(item.url)
          } else {
            customer_images.push(item.url)
          }
        })
        //----Setting up page data----//
        // Page data coordinates are the spot's ones by default now.
        that.setData({
          spot: spot,
          marker: markers,
          latitude: spot.latitude,
          longitude: spot.longitude,
          user_images: user_images,
          customer_images: customer_images
        });
        wx.hideToast();
      }
    });

  // map and more photos tab bar
    // var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.sliderWidth) / 2,
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
    //----TO BE UNCOMMENTED IF BUGS----//
    // wx.pageScrollTo({
    //   scrollTop: 500,
    //   duration: 300
    // })
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 28
    })
  },

  //------------Lifecycle function--Called when page is initially rendered------------//
  onReady: function () {

  },

  //------------Lifecycle function--Called when page show------------//
  onShow: function () {
    let options = this.data.options;
    console.log("OPTIONS On show", this.data.options)
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
        const marker = [{
          id: spot.id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          name: spot.name
        }]
        page.setData({
          spot: spot,
          marker: marker,
          latitude: spot.latitude,
          longitude: spot.longitude
        });
        wx.hideToast();
      }
    });
  },

  //------------Lifecycle function--Called when page hide------------//
  onHide: function () {

  },

  //------------Lifecycle function--Called when page unload------------//
  onUnload: function () {

  },

  //------------Page event handler function--Called when user drop down------------//
  onPullDownRefresh: function () {

  },

  //------------Called when page reach bottom------------//
  onReachBottom: function () {

  },

  //------------Called when user click on the top right corner to share------------//
  onShareAppMessage: function () {

  },


 //------------Creating a map on this page------------//
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')

  },

  //------------Getting spot's location------------//
  // We need to change the page data coordinates to the spot's ones.
  // This because they get changed to the user's ones when "moveToLocation" function is called.
  getCenterLocation: function () {
    let that = this
    that.setData({
      latitude: that.data.spot.latitude,
      longitude: that.data.spot.longitude
    })
    this.mapCtx.getCenterLocation()
  },

  //------------Centering map on spot's location------------//
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
    // "moveToLocation" seems to move and center by default on the user's location.
    // It also seems to change the page data coordinates to the user's ones.
  },
})
