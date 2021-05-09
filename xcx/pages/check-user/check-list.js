const app = getApp()
const CONFIG = require('../../config.js')
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    statusType: [
      {
        status: 4,
        label: '待审核'
      },
      {
        status: 5,
        label: '待补充'
      },
      {
        status: 1,
        label: '已完成'
      },
    ],
    status: 4,//默认第一个为审核中的状态
    flag:false,
    currentTaskList:[],
    hiddenmodalput:true,
    id:"",
    inputvalue:""
  },
  statusTap: function(e) {//tab切换
    let status = e.currentTarget.dataset.status;
    this.setData({
      status:status
    });
    //console.log(e.currentTarget.dataset)
    this.queryUserList(status);
  },
 
  checkPic:function(e){
  //  console.log("点击查看图片",e)
    var images =[e.currentTarget.dataset.pic]
    //console.log(images);
    wx.previewImage({
      current: images[0] , //当前预览的图片
       urls: images,  //所有要预览的图片
    })
  },
  shenhe1:function(e){
          // 防止连续点击--开始
          if (this.data.payButtonClicked) {
            return
          }
          this.data.payButtonClicked = true
          setTimeout(() => {
            this.data.payButtonClicked = false
          }, 3000)  // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
    
   let id = e.currentTarget.dataset.id;
   this.auditUserInfo(id,1,"");
  },
  shenhe2:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({  
      hiddenmodalput: !this.data.hiddenmodalput ,
      id : id
   })  
   },
 //取消按钮  
  cancel: function(){  
      this.setData({  
          hiddenmodalput: true  
      });  
  },  
  //确认  驳回
  confirm: function(e){  
    let id = this.data.id;
    let  notPassReason = this.data.inputvalue;
    if(notPassReason==''||notPassReason.length<2){
      wx.showToast({
        title: '请简述理由',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if(notPassReason.length>40){
      wx.showToast({
        title: '描述过长',
        icon: 'none',
        duration: 1500
      })
      return
    }
    this.setData({  
      hiddenmodalput: true  
    }) 
   
    this.auditUserInfo(id,2,notPassReason);
  },
  setValue(e){
    this.setData({
      inputvalue:e.detail.value
    })
  },
  auditUserInfo:function(id,isPass,notPassReason){//审批
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url:  CONFIG.url+'/audit/auditUserInfo',
      data: {
        id:id,
        isPass:isPass,
        notPassReason:notPassReason
      },
      method: "get",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res) {

        console.log(res.data)
        if(res.data.code==500){
          wx.showToast({
            title: res.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }else{
          that.queryUserList(that.data.status);//默认查询任务状态为待审核 审核中的数据
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  updateReceivedTaskStautus:function(id,newStatus){//提交操作
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url:  CONFIG.url+'updateReceivedTaskStautus',
      data: {
        id:id,
        taskStatus:newStatus
      },
      method: "POST",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res) {

        console.log(res.data)
        if(res.data.code==500){
          wx.showToast({
            title: res.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }else{
          that.queryUserPublishTaskChildListByPublishId(that.data.taskId,that.data.status);//默认查询任务状态为待审核 审核中的数据
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  queryUserList:function(status){
    var that = this
    wx.showLoading({
      title: '查询中',
    })
    wx.request({
      url:  CONFIG.url+'/user/queryUserList',
      data: {
        status:status
      },
      method: "post",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res) {

       console.log(res.data)
        if(res.data.code==500){
          wx.showToast({
            title: res.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return 
        }
        if( res.data.list.length!=0){
          that.setData({ 
            currentTaskList : res.data.list,
            flag:true
          })
        }else{
          that.setData({
            currentTaskList :[],
            flag:false
          })
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryUserList(4);//默认查询任务状态为待审核 审核中的数据
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