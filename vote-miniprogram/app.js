// 小程序入口
App({
  onLaunch() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.screenWidth = res.screenWidth
      }
    })
    // 不自动登录：退出后需在「我的」页点击登录/注册
  },
  globalData: {
    statusBarHeight: 20,
    screenWidth: 375
  }
})
