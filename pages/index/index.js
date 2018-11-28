//index.js
//获取应用实例
const app = getApp()
var sliderWidth = 96;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    skatespots: {},
    // tab of list and map 
    tabs: ["List", "Map"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // tab of types
    // map 
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

  // tab bar function 
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    // Save reference to page
    const page = this;


    // Get api data
    wx.request({
      url: 'http://localhost:3000/api/v1/spots',
      method: 'GET',
      success(res) {
        console.log("je reçois les data de l'API res", res)
        const skatespots = res.data.skatespots;
        // Update local data
        page.setData({
          skatespots: skatespots
        });

        wx.hideToast();
      }
    });
  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }, 


  // filter tags 
//     function filterType(event) {
//   const all = document.querySelectorAll('all');
//   const skateparks = document.querySelectorAll('skateparks')
//   const pyramids = document.querySelectorAll('pyramids')
//   const ledges = document.querySelectorAll('ledges')
//   const pyramids = document.querySelectorAll('pyramids')
//  }
//   function show_skateparks() {
//     for (var i = 0; i < skateparks.length; ++i) {
//       skateparks[i];
//     }
//   }
//   document.addEventListener('click', filterType)



  // links to the show page 
  showSkatespot: function (e) {
    console.log(1, e)
    const data = e.currentTarget.dataset.id;
    const object = e.currentTarget.dataset.object
    console.log('data transfer to the show page', data)

    wx.navigateTo({
      url: `../show/show?id=${data}&name=${object.name}&type=${object.type}&description=${object.description}`
    });
  },

// map
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
