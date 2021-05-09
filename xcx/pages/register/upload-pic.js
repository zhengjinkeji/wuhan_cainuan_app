// pages/register/info.js
const app = getApp()
const CONFIG = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos1:'../../images/upload_icon.png',
    photos2: '../../images/upload_icon.png',
    photos3: '../../images/upload_icon.png',
    flag1:false,
    flag2: false,
    flag3: false,
    windowHeight:0,
    windowWidth:0,
    images1: [],
    images2: [],
    images3: []
  },
  touchphoto1:function(){
    var that = this;
    let maxSize = 1024 * 1024;
    wx.chooseImage({
      count: 1,//最多可以选择的图片总数
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        
        if (res.tempFiles[0].size > maxSize){
          wx.showModal({
            content: '图片太大，不允许上传',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
         })
        }else{
          //console.log("1----" + res.tempFilePaths[0]);
          that.setData({
            images1: res.tempFilePaths,
            photos1: res.tempFilePaths[0],
            flag1: true
          })
        }
      }
    })
  },
  yulan1:function(){
    var images = this.data.images1
    wx.previewImage({
      current: images[0] , //当前预览的图片
       urls: images,  //所有要预览的图片
    })
  },
  touchphoto2: function () {
    var that = this;
    let maxSize = 1024 * 1024;
    wx.chooseImage({
      count: 1,//最多可以选择的图片总数
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        
        if (res.tempFiles[0].size > maxSize) {
          wx.showModal({
            content: '图片太大，不允许上传',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
               
              }
            }
          })
        } else {
          //console.log('2---' + res.tempFilePaths[0])
          that.setData({
            images2: res.tempFilePaths,
            photos2: res.tempFilePaths[0],
            flag2: true
          })
        }
      }
    })
  },
  yulan2: function () {
    var images = this.data.images2
    wx.previewImage({
      current: images[0], //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  touchphoto3: function () {
    var that = this;
    let maxSize = 1024 * 1024;
    wx.chooseImage({
      count: 1,//最多可以选择的图片总数
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        
        if (res.tempFiles[0].size > maxSize) {
          wx.showModal({
            content: '图片太大，不允许上传',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } else {
          that.setData({
            
          })
          //console.log('3----' + res.tempFilePaths[0])
          that.setData({
            images3: res.tempFilePaths,
            photos3: res.tempFilePaths[0],
            flag3: true
          })
          
        }
      }
    })
  },
  yulan3: function () {
    var images = this.data.images3
    wx.previewImage({
      current: images[0], //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  submitForm:function(){
    var that = this;
    // if (that.data.images1.length!=1){
    //   wx.showToast({
    //     title: '请选择身份证正面照片',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (that.data.images2.length != 1){
    //   wx.showToast({
    //     title: '请选择身份证反面照片',
    //     icon: 'none'
    //   })
    //   return;
    // }
    if (that.data.images3.length != 1) {
      wx.showToast({
        title: '请选择营业执照副本照片',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在上传...',
      mask: true
    })
    var account = that.data.account;
    // var picType='';
    // var list = [];
    // list.push(that.data.images1[0]);
    // list.push(that.data.images2[0]);
    // list.push(that.data.images3[0])
    // for(var i=0;i<list.length;i++){
    //   //console.log(i+""+list[i])
    //   if(i==0){
    //     picType = "card1";
    //   } else if (i ==1){
    //     picType = "card2";
    //   } else if(i==2){
    //     picType = "card3";
    //   }
      wx.uploadFile({
        url: CONFIG.url+'/upload/uploadBusinessLicense',
        filePath: that.data.images3[0],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'Content-Type': 'application/json',
          'account': account,
         // 'picType': picType
        },
        success: function (res) {
          if (res.statusCode == 200) {
            // wx.showToast({
            //   title: '上传成功 ',
            //   icon: 'success',
            //   duration:500
            // })
              wx.hideLoading();
              wx.showModal({
                title: '注册状态',
                content: '注册成功，资料审核中',
                showCancel: false,
                success: function () {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              })
          }
        }
      })
    //}
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var account = options.account;
    that.setData({
      account: account
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