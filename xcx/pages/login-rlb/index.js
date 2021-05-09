const app = getApp();
const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config')
Page({
    /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: ''
  },
  getUserInfo: function(e) {
    let that = this;
    // console.log(e)
    // 获取用户信息
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("获取用户信息成功", res)
              wx.setStorageSync('userInfo', res.userInfo)
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
              })
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          //that.showSettingToast("请授权")暂时不用
        }
      }
    })
  },
  // 打开权限设置页提示框  暂时不用
  showSettingToast: function(e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const userInfo = wx.getStorageSync('userInfo')
    //console.log("userInfo",userInfo)
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          model:res.model,
        })
      }
    });

      that.setData({
        avatarUrl: userInfo.avatarUrl,
      })
    
  },
  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var subPassword = e.detail.value.subPassword;
    var that = this;
    // 判断账号是否为空和判断该账号名是否被注册
    if ("" == account) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      return;
    }
    
    // 判断密码是否为空
    if ("" == password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    let data ={};
    data.username =account
    data.pwd = password
    data.deviceId = "自定义"
    data.deviceName = this.data.model

    // WXAPI.login_username(data).then(function (res) {
    //   console.log("login-rlb-index",res)
    //   if (res.code == 10000) {
    //     // 去注册
    //     //_this.register(page)
    //     return;
    //   }
    //   if (res.code != 0) {
    //     // 登录错误
    //     wx.showModal({
    //       title: '无法登录',
    //       content: res.msg,
    //       showCancel: false
    //     })
    //     return;
    //   }
    //   WXAPI.userDetail(res.data.token).then(function (res2){
    //     if (res2.code == 0) {
    //       wx.setStorageSync('userDetail', res2.data.base)
    //       wx.setStorageSync('is_admin', res2.data.ext)
    //      }
    //   })
      
    //   wx.setStorageSync('token', res.data.token)
    //   wx.setStorageSync('uid', res.data.uid)
    //   let token = res.data.token;
    //   wx.login({
    //     success: function (res3) {
    //       let code = res3.code; // 微信登录接口返回的 code 参数，下面绑定微信需要用到
    //       console.log("login-rlb-index 微信登录接口返回的 code 参数",code);//021l07ll2nq3x64RYlol21VLEi1l07lG
    //       WXAPI.bindOpenid(token,code).then(function (res4){
    //         console.log("login-rlb-index--bindOpenid",res4)
    //       })
    //     }
    //   })

    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // })
    // return
    wx.request({
      url: CONFIG.url + '/checkUserStatus',
      data: {
        "account": account,
      },
      success: function (res) {
       
        if (res.data.code == 200) {
            let status = res.data.list[0].status;
            let not_pass_reason = res.data.list[0].not_pass_reason;
            if(status==5){
              if(not_pass_reason){
                wx.showModal({
                  title: '待补充状态',
                  content: "未通过请重新上传资料,提示："+not_pass_reason,
                  showCancel:false,
                  success:function(){
                    //app.globalData.account=account
                    wx.redirectTo({
                      url: '/pages/register/upload-pic?account='+account
                    })
                  }
                })
              }else{
                wx.showModal({
                  title: '待补充状态',
                  content: '去上传资料',
                  showCancel:false,
                  success:function(){
                    //app.globalData.account=account
                    wx.redirectTo({
                      url: '/pages/register/upload-pic?account='+account
                    })
                  }
                })
              }
             
            }
            if(status==4){
              wx.showToast({
                title: "审核中",
                icon: 'none'
              })
              return
            }
            if(status==1){
              WXAPI.login_username(data).then(function (res) {
                console.log(res)
                if (res.code == 10000) {
                  // 去注册
                  //_this.register(page)
                  return;
                }
                if (res.code != 0) {
                  // 登录错误
                  wx.showModal({
                    title: '无法登录',
                    content: res.msg,
                    showCancel: false
                  })
                  return;
                }
                
                WXAPI.userDetail(res.data.token).then(function (res2){
                  console.log("WXAPI.userDetail",res2)
                  if (res2.code == 0) {
                   
                    wx.setStorageSync('userDetail', res2.data.base);
                    wx.setStorageSync('is_admin', res2.data.ext);
                    if(res2.data.userLevel){
                      let levelId = res2.data.userLevel.id;
                      WXAPI.userLevelDetail(levelId).then(function (res3){
                        console.log("WXAPI.userLevelDetail",res3)
                        if(res3.code == 0){
                          wx.setStorageSync('rebate', (res3.data.info.rebate/10).toFixed(2));
                        }else{
                          wx.setStorageSync('rebate', 1);
                        }
                      })
                    }else{
                      console.log("WXAPI.userLevelDetail","没有会员")
                      wx.setStorageSync('rebate', 1);
                    }
                   
                   }
                })
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('uid', res.data.uid)
                let token = res.data.token;
                wx.login({
                  success: function (res3) {
                    let code = res3.code; // 微信登录接口返回的 code 参数，下面绑定微信需要用到
                    console.log("login-rlb-index 微信登录接口返回的 code 参数",code);//021l07ll2nq3x64RYlol21VLEi1l07lG
                    WXAPI.bindOpenid(token,code).then(function (res4){
                      console.log("login-rlb-index--bindOpenid",res4)
                    })
                  }
                })
                wx.switchTab({
                  url: '/pages/index/index'
                })
              })
            }
         
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          return
          
        }
      }
    })

 
     return
    // 验证都通过了执行登录方法
    wx.request({
      url: app.globalData.authUrl,
      data: {
        "username": account,
        "password": password
      },
      method:'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
         
          if (res.data.status==1){
            app.globalData.token = res.data.token
            app.globalData.account = res.data.account
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration:2000,
              success: function (res) {
               
              }
            })
            wx.switchTab({
              url: '../index/index'
            })
          }else if(res.data.status==4){
            wx.showModal({
              title: '审核中',
              content: '若您还没有上传资料，请去上传资料。',
              confirmText:'上传资料',
              cancelText:'已上传',
              success(result) {
                if (result.confirm) {
                  console.log('用户点击确定')
                  wx.redirectTo({
                    url: '/pages/register/info?account=' + res.data.account
                  })
                } else if (result.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } 
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  queryUserList(){//验证登录
    
  },
  register:function(){
    wx.navigateTo({
      url: '../register/clause'
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