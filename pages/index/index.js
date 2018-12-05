//index.js
//获取应用实例
const app = getApp()
var sliderWidth = 96;

Page({

//------------Setting up global data for this page------------//
  data: {
    bannerImages: ['https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/305250/pexels-photo-305250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
    autoplay: false,
    userInfo: {},
    hasUserInfo: false,

    skatespots: [ ], // Initializing skatespots as an empty array. Will be replaced during GET request.
    activespots: [],  // Initializing activespots as an empty array. Will be replaced during GET request.

    // tab of list and map
    tabs: ["Skate Spots", "Skate Map"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    //------------Map------------//
    //------------Adding markers to the map------------//
    // Initialize "markers" as an empty array to then be able to fill it out with hashes with each spot id+longitude+latitude+address
    latitude: null,
    longitude: null,
    accuracy: null,
    markers: [ ],

    //------------Tags in the scroll list------------//
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
      { id: '2' }
    ]
  },
//------------End of global data set up------------//

// skate spots and map tab bar 
  scrollLeft: function(e) {
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
  scrollRight: function(e) {
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


  onLoad: function(options) {
    console.log(app.globalData)

    let page = this // Defining temporary variable to be able to call on the "this" one and get page data.

    //------------GET Request to get all spots------------//
    wx.request({

      // url: 'https://skatecity.wogengapp.cn/api/v1/spots/',
      url: app.globalData.host + 'api/v1/spots/',

      method: 'GET',
      success(res) {
        console.log("Data received", res)
        let skatespots = res.data.spots;
        app.globalData['activespots'] = skatespots;
        // Update local data
        page.setData({
          skatespots: skatespots,
          activespots: skatespots
        });
        wx.hideToast();
        console.log("SKATESPOTS", skatespots)
      }
    });



    // Display toast when loading
    wx.showToast({
      title: 'Updating',
      icon: 'success',
      duration: 3000
    });



    wx.getLocation({
      type: 'gcj02', 
      success: function(res) {
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

//------------Tabbar click trigger event------------//
  tabClick: function(e) {
    console.log("E",e.currentTarget.id)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    //------------Getting all spots' coordinates------------//
    // Only getting the coordinates if the user clicks on the "SkateMap" tab.
    // This tab's id number is "1"
    if (e.currentTarget.id == 1) {    
        let that = this
        console.log("Spots", that.data.skatespots)
        let markers = that.data.skatespots.map((spot) => {
          return {
            iconPath: '/assets/pin.png',
            width: 30,
            height: 30,
            id: spot.id,
            address: spot.address,
            longitude: spot.longitude,
            latitude: spot.latitude
          }
        })
        that.setData({
          markers: markers
        })
    }
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




// filter tags 
  filterType: function(e) {
    const tag = e.currentTarget.dataset.id;
    console.log("log of the tag :", tag)
    let page = this
    // if (page.data.tag == tag) {
    //   page.setData({
    //     tag: null
    //   });
    // } else {
    //   page.setData({
    //     tag: tag
    //   });
    // }
    // console.log(page.data.tag)
    if (tag != 'All') {
      var activespots = []
      const length = this.data.skatespots.length
      for (let i = 0; i < length; ++i) {
        var spot = this.data.skatespots[i]
          if (spot.tag_list.includes(tag)) {
          activespots.push(spot);
          console.log(spot)
          console.log(this.data.activespots)
        } 
      }
      page.setData({
        activespots: activespots
      })
    } else {
      page.setData({
        activespots: page.data.skatespots
      })
    }
  },


  //------------Links to the show page from List Tab------------//
  showSkatespot: function(e) {
    console.log(1, e)
    const data = e.currentTarget.dataset.id;
    console.log('check data', data)
    const object = e.currentTarget.dataset.object
    console.log('data transfer to the show page', data)

    wx.navigateTo({
      url: `../show/show?id=${data}`
    });
  },


/* FIXED TAB BAR AT THE BOTTOM */
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



  onReady: function(e) {
    // Use wx.createMapContext to acquire map context
    this.mapCtx = wx.createMapContext('myMap')
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },
})