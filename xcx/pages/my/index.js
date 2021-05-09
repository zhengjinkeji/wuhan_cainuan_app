const app = getApp()
const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
Page({
	data: {
		balance: 0,
		freeze: 0,
		score: 0,
		score_sign_continuous: 0,
		tabClass: ["", "", "", "", ""],
		userInfo: null,
		wxlogin: true, //是否隐藏登录弹窗
		token: null,
		version: null,
		noticeList: [],
		loaded: false,//避免首次打开用户中心重复获取数据
		userNickName:"",
		isAdmin : "",
		falg:false
	},
	onLoad: function() { 
		this.getNoticeList();
		
	},
	onShow() {
		AUTH.checkHasLogined().then( isLogined =>{
			if(isLogined){
				this.getUserApiInfo()
				this.getUserAmount()
				this.checkScoreSign()
				this.getOrderStatistics()
				this.setData({
					loaded: true
				})
			}
		})
		let token = wx.getStorageSync('token')
		if(!token){
			this.setData({
				falg: false,
			})
		}else{
			this.setData({
				falg: true
			})
		}
		if(wx.getStorageSync('userDetail')==undefined){
			this.setData({
				userDetail : undefined,
			})
		}else{
			this.setData({
				userDetail : wx.getStorageSync('userDetail'),
			})
		}

		if(wx.getStorageSync('is_admin')==undefined){
			this.setData({
				isAdmin : undefined,
			})
		}else{
			this.setData({
				isAdmin : wx.getStorageSync('is_admin').is_admin,
			})
		}
		this.setData({
			version: wx.getStorageSync('app_show_pic_version'),
		})
		//更新订单状态
	},
	showAuth() {
		this.setData({
			wxlogin: false
		})
	},
	/*
	 *授权登录成功后回调
	 */
	afterAuth(e) {
		this.setData({
			wxlogin: true,
		})
		if(!this.data.loaded){
			this.getUserApiInfo()
		  this.getUserAmount()
			this.checkScoreSign()
			this.getOrderStatistics()
		}
		
	},
	getUserApiInfo: function() {
		WXAPI.userDetail(wx.getStorageSync('token')).then(res => {
		//	console.log("getUserApiInfo",res.data);
			if (res.code == 0) this.setData({
				userInfo: res.data
			})
		})
	},
	getUserAmount: function() {
		WXAPI.userAmount(wx.getStorageSync('token')).then(res => {
			if (res.code == 0) {
				console.log("getUserAmount",res.data);
				this.setData({
					balance: res.data.balance,
					freeze: res.data.freeze,
					score: res.data.score
				});
			}
		})
	},
	checkScoreSign: function() {
		WXAPI.scoreTodaySignedInfo(wx.getStorageSync('token')).then(res => {
		//	console.log("checkScoreSign",res.data);
			if (res.code == 0) {
				this.setData({
					score_sign_continuous: res.data.continuous
				});
			}
		})
	},
	getOrderStatistics() {
		WXAPI.orderStatistics(wx.getStorageSync('token')).then(res => {
			if (res.code == 0) {
				if (res.data.count_id_no_pay > 0) {
					wx.setTabBarBadge({
						index: 3,
						text: '' + res.data.count_id_no_pay + ''
					})
				} else {
					wx.removeTabBarBadge({
						index: 3,
					})
				}
				this.setData({
					noplay: res.data.count_id_no_pay,
					notransfer: res.data.count_id_no_transfer,
					noconfirm: res.data.count_id_no_confirm,
					noreputation: res.data.count_id_no_reputation
				});
			}
		})
	},
	getNoticeList() {
		WXAPI.noticeList({
			type: 'notice'
		}).then(res => {
			if (res.code == 0) {
				this.setData({
					noticeList: res.data
				});
			}
		})
	},
	score: function() {
		wx.navigateTo({
			url: "/pages/sign/index"
		})
	},
	navigateToPage(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	outlogin(){
		let that = this
		wx.showModal({
			title: '提示',
			content: '是否退出？',
			confirmText:'确定',
			cancelText:'取消',
			success(result) {
				if (result.confirm) {
					console.log('用户点击确定')
					wx.setStorageSync("token","")
					wx.setStorageSync("userDetail","")
					wx.setStorageSync("is_admin","")
					wx.setStorageSync("uid","")
					that.setData({
						balance : ""
					})
					wx.switchTab({
						url: '/pages/index/index',
					});
				} else if (result.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}
})
