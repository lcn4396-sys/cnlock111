const bannerApi = require('../../api/banner.js')
const categoryApi = require('../../api/category.js')

Page({
  data: {
    bannerList: [],
    categoryList: [],
    categoryId: null,
    showCreateModal: false
  },
  onLoad() {
    this.loadBanner()
    this.loadCategory()
  },
  loadBanner() {
    bannerApi.list().then(res => {
      const list = (res && res.data) ? res.data : []
      this.setData({ bannerList: list })
    }).catch(() => {
      this.setData({ bannerList: [] })
    })
  },
  loadCategory() {
    categoryApi.list().then(res => {
      const list = (res && res.data) ? res.data : []
      this.setData({ categoryList: list })
    }).catch(() => {
      this.setData({ categoryList: [] })
    })
  },
  onMore() {
    wx.showActionSheet({ itemList: ['关于'], success: () => {} })
  },
  onShowCreate() {
    this.setData({ showCreateModal: true })
  },
  onCloseCreate() {
    this.setData({ showCreateModal: false })
  },
  onCreateSubmit(e) {
    this.setData({ showCreateModal: false })
    wx.navigateTo({ url: '/pages/vote-create/vote-create' })
  },
  onJoinVote() {
    // 投票列表为 tabBar 页面，必须使用 switchTab
    wx.switchTab({ url: '/pages/vote-list/vote-list' })
  },
  onCategorySelect(e) {
    this.setData({ categoryId: e.detail.id })
  },
  onBannerTap() {}
})
