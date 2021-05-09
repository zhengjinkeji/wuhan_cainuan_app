const WXAPI = require('apifm-wxapi')
const CONFIG = require('../config')
async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  
  const token = wx.getStorageSync('token')
  console.log(token);
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function login(page,data){
  const _this = this
  wx.login({
    success: function (res) {
      WXAPI.login_wx(res.code).then(function (res) {        
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
          if (res2.code == 0) {
          wx.setStorageSync('userDetail', res2.data.base)
          wx.setStorageSync('is_admin', res2.data.ext)
         }
        })
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('uid', res.data.uid)
        if ( page ) {
          page.onShow()
        }
      })
    }
  })
}

async function register(page,company,account,password) { 
  let _this = this;
  wx.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      console.log("utils-auth.js 微信登录接口返回的 code 参数",code);//021l07ll2nq3x64RYlol21VLEi1l07lG
    }
  })
  wx.getUserInfo({
    success: function (res) {
      let iv = res.iv;
      let encryptedData = res.encryptedData;
      let referrer = '' // 推荐人
      let referrer_storge = wx.getStorageSync('referrer');
      if (referrer_storge) {
        referrer = referrer_storge;
      }
      // 下面开始调用注册接口
      WXAPI.register_username({
        nick : company,
        username: account,
        pwd: password,
        referrer: referrer
      }).then(function (res) {
        console.log("utils-auth-register",res);
          wx.request({
            url: CONFIG.url+'/register/register',
            data: {
              "company":  company,
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
                      url: '/pages/register/upload-pic?account='+account
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
      })
      // WXAPI.register_complex({
      //   code: code,
      //   encryptedData: encryptedData,
      //   iv: iv,
      //   referrer: referrer
      // }).then(function (res) {
      //   _this.login(page);
      // })
    }
  })
}

function login_rlb(nick,username,pwd){
  
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}

async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}


module.exports = {
  checkHasLogined: checkHasLogined,
  login: login,
  register: register,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize
}