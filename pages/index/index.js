//index.js
//获取应用实例
const app = getApp()
var sliderWidth = 96;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    skatespots: {},
    // tab of list and map 
    tabs: ["Skate Spots", "Map"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    
    // map 
    latitude: null,
    longitude: null,
    accuracy: null,
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

    let page = this

    wx.request({
      // url: 'http://skatecity.wogengapp.cn/api/v1/spots/',
      url: 'http://localhost:3000/api/v1/spots/',
      method: 'GET',
      success(res) {
        console.log("Data received", res)
        const skatespots = res.data.spots;
        // Update local data
        page.setData({
          skatespots: skatespots
        });
        wx.hideToast();
        console.log("SKATESPOTS", page.skatespots)
  
      }

    });

    

    // Display toast when loading
    wx.showToast({
      title: 'Updating',
      icon: 'success',
      duration: 3000
    });

    

    wx.getLocation({
      type: 'wgs84', // **1
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var accuracy = res.accuracy
        console.log("location on load", res)
        page.setData({
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy
        })
      }
    })


  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //getCenterLocation: function (e) {
  //let data = this
  //wx.openLocation({
  //latitude: data.data.latitude,
  //longitude: data.data.longitude,
  //scale: 28
  //})
  //},


     // Save reference to page

    // Get api data
    

  // links to the show page 
  showSkatespot: function (e) {
    console.log(1, e)
    const data = e.currentTarget.dataset.id;
    console.log('check data', data)
    const object = e.currentTarget.dataset.object
    console.log('data transfer to the show page', data)

    wx.navigateTo({
      url: `../show/show?id=${data}`
    });
  },


  onReady: function (e) {
    // Use wx.createMapContext to acquire map context
    this.mapCtx = wx.createMapContext('myMap')
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

})