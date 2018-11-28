//index.js
//获取应用实例
const app = getApp()

var sliderWidth = 100;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    skatespots: {},
    tabs: ["List", "Map"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    latitude: 31.229557,
    longitude: 121.445293,
    markers: [{
      id: 1,
      latitude: 31.223790,
      longitude: 121.445293,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 31.229557,
      longitude: 121.445293,
      iconPath: '/assets/location copy.png'
    }, {
        latitude: 31.223790,
        longitude: 121.445293,
      iconPath: '/assets/location copy.png'
    }]
  },

  onLoad: function (options) {

    // Display toast when loading
    wx.showToast({
      title: 'Updating',
      icon: 'success',
      duration: 3000
    });

    // Update local data
    this.setData(app.globalData)

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

/**MAP  */
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 31.229557,
        longitude: 121.445293,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 31.229557,
        longitude: 121.445293,
      }, {
          latitude: 31.223790,
          longitude: 121.445293,
      }]
    })
  }
 
})
