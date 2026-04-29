const voteApi = require('../../api/vote.js')

Page({
  data: {
    tab: 'created',
    createdList: [],
    joinedList: [],
    loading: false
  },
  onLoad() {
    this.loadCreated()
    this.loadJoined()
  },
  onShow() {
    this.loadCreated()
    this.loadJoined()
  },
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ tab })
  },
  loadCreated() {
    this.setData({ loading: true })
    voteApi.myCreated({ page: 0, size: 50 }).then(res => {
      const list = (res && res.data && res.data.content) ? res.data.content : []
      this.setData({ createdList: list, loading: false })
    }).catch(() => this.setData({ loading: false }))
  },
  loadJoined() {
    voteApi.myJoined({ page: 0, size: 50 }).then(res => {
      const list = (res && res.data && res.data.content) ? res.data.content : []
      this.setData({ joinedList: list })
    }).catch(() => {})
  },
  onVoteTap(e) {
    const id = e.currentTarget.dataset.id || (e.detail && e.detail.id)
    if (id) wx.navigateTo({ url: '/pages/vote-detail/vote-detail?id=' + id })
  }
})
