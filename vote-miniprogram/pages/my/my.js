const userApi = require('../../api/user.js')
const myApi = require('../../api/my.js')
const auth = require('../../utils/auth.js')
const authApi = require('../../api/auth.js')

Page({
  data: { summary: null, loggedIn: false },
  onLoad() {
    this.checkLogin()
  },
  onShow() {
    this.checkLogin()
  },
  checkLogin() {
    const loggedIn = auth.isLoggedIn()
    this.setData({ loggedIn })
    if (loggedIn) this.loadSummary()
  },
  loadSummary() {
    if (!auth.getToken()) return
    myApi.actions().then(res => {
      const summary = (res && res.data) ? res.data : null
      this.setData({ summary })
    }).catch(() => {})
  },
  /** 手机号快捷登录：getPhoneNumber 授权后拿 code 调后端 */
  onGetPhoneNumber(e) {
    if (e.detail.errMsg && e.detail.errMsg.indexOf('ok') === -1) {
      if (e.detail.errMsg.indexOf('deny') !== -1 || e.detail.errMsg.indexOf('cancel') !== -1) {
        return
      }
      wx.showToast({ title: '需要授权手机号才能登录', icon: 'none' })
      return
    }
    const code = e.detail.code
    if (!code) {
      wx.showToast({ title: '未获取到手机号授权', icon: 'none' })
      return
    }
    wx.showLoading({ title: '登录中...' })
    authApi.loginWithPhone(code).then(() => {
      wx.hideLoading()
      wx.showToast({ title: '登录成功', icon: 'success' })
      this.setData({ loggedIn: true })
      this.loadSummary()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: (err && err.message) || '手机号登录失败', icon: 'none' })
    })
  },
  /** 微信一键登录（code 换 token） */
  goLogin() {
    wx.showLoading({ title: '登录中...' })
    authApi.loginWithWx().then(() => {
      wx.hideLoading()
      wx.showToast({ title: '登录成功', icon: 'success' })
      this.setData({ loggedIn: true })
      this.loadSummary()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: (err && err.message) || '登录失败', icon: 'none' })
    })
  },
  goMyVote() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/my-vote/my-vote' })
  },
  goMyComment() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/my-comment/my-comment' })
  },
  goMyReport() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/my-report/my-report' })
  },
  goSettings() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/settings/settings' })
  },
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          auth.clearToken()
          userApi.logout().catch(() => {})
          wx.showToast({ title: '已退出', icon: 'none' })
          this.setData({ summary: null, loggedIn: false })
        }
      }
    })
  }
})
