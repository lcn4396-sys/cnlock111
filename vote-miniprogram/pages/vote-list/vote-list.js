const voteApi = require('../../api/vote.js')
const categoryApi = require('../../api/category.js')

Page({
  data: {
    list: [],
    categoryList: [],
    categoryId: null,
    page: 0,
    size: 10,
    loading: false,
    hasMore: true
  },
  onLoad() {
    this.loadCategory()
    this.loadList()
  },
  loadCategory() {
    categoryApi.list().then(res => {
      const list = (res && res.data) ? res.data : []
      this.setData({ categoryList: list })
    }).catch(() => {})
  },
  loadList() {
    if (this.data.loading || !this.data.hasMore) return
    this.setData({ loading: true })
    const params = { page: this.data.page, size: this.data.size }
    if (this.data.categoryId != null && this.data.categoryId !== '') params.categoryId = this.data.categoryId
    voteApi.list(params)
      .then(res => {
        const content = (res && res.data && res.data.content) ? res.data.content : (Array.isArray(res && res.data) ? res.data : [])
        const list = this.data.page === 0 ? content : this.data.list.concat(content)
        this.setData({
          list,
          loading: false,
          hasMore: content.length >= this.data.size,
          page: this.data.page + 1
        })
      })
      .catch(() => this.setData({ loading: false }))
  },
  loadMore() { this.loadList() },
  onCategorySelect(e) {
    this.setData({ categoryId: e.detail.id, page: 0, list: [], hasMore: true })
    this.loadList()
  },
  onBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 })
    } else {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },
  onCardTap(e) {
    wx.navigateTo({ url: '/pages/vote-detail/vote-detail?id=' + (e.detail.id || e.currentTarget.dataset.id) })
  }
})
