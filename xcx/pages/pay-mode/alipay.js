const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    WXAPI.banners({
      type: 'alipay'
    }).then(function (res) {
      if (res.code == 700) {
       
      } else {
        _this.setData({
          banners: res.data,
          swiperMaxNumber: res.data.length
        });
      }
    })
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  imgClick(e){
    //console.log(e)
    var images = [e.currentTarget.dataset.pic];
    wx.previewImage({
      current: images[0] , //当前预览的图片
       urls: images,  //所有要预览的图片
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})