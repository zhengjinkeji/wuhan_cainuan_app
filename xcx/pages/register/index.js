const app = getApp();
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
 
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl:'',
    isDisable:false
  },
  onLoad: function () {
    var that = this;
    const userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo",userInfo)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });

      that.setData({
        avatarUrl: userInfo.avatarUrl,
      })
   
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
          //that.showSettingToast("请授权") 暂时不用
        }
      }
    })
  },

  // 打开权限设置页提示框 暂时不用
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
  formSubmit: function (e) {
    console.log("开始注册!");
    // // 防止连续点击--开始
    // if (this.data.payButtonClicked) {
    //   wx.showToast({
    //     title: '休息一下~',
    //     icon: 'none'
    //   })
    //   return
    // }
    // this.data.payButtonClicked = true
    // setTimeout(() => {
    //   this.data.payButtonClicked = false
    // }, 3000)  // 可自行修改时间间隔（目前是3秒内只能点击一次按钮）
    // // 防止连续点击--结束
    
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用
    var company = e.detail.value.company;
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var subPassword = e.detail.value.subPassword;
    var that = this;
  
    // 判断账号是否为空和判断该账号名是否被注册
    if ("" == company) {
      wx.showToast({
        title: '公司名不能为空',
        icon: 'none'
      })
      return;
    }
    if ("" == account) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      return;
    }
    if ((!/^[A-Za-z0-9]+$/.test(account))) {
      wx.showToast({
      title: '验证由数字和26个英文字母组成',
      duration: 2000,
      icon: 'none'
      });
      return;
    }
    if (account.length < 5) {
      wx.showToast({
        title: '账号长度小于5',
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
    if (password.length < 6) {
      wx.showToast({
        title: '密码长度小于6',
        icon: 'none'
      })
      return;
    }
    // // 两个密码必须一致
    // if (subPassword != password) {
    //   wx.showToast({
    //     title: '输入密码不一致',
    //     icon: 'none'
    //   })
    //   return;
    // }
  
    // 验证都通过了执行注册方法
    this.setData({
      isDisable:true 
    })
    AUTH.register(Page,company,account,password)
    return
    wx.request({
      url: app.globalData.adminUrl + '/register/register',
      data: {
        "company": company,
        "account": account,
        "password": password
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showModal({
            title: '注册状态',
            content: '注册成功，去上传资料',
            showCancel:false,
            success:function(){
              //app.globalData.account=account
              wx.redirectTo({
                url: '/pages/register/info?account='+account
              })
            }
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  }
})
