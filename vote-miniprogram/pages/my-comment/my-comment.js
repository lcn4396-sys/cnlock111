const myApi = require('../../api/my.js')

function formatTime(str) {
  if (!str) return ''
  try {
    const d = new Date(str)
    if (isNaN(d.getTime())) return str
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return m + '-' + day + ' ' + h + ':' + min
  } catch (e) { return str }
}

Page({
  data: { list: [], loading: false },
  onLoad() {
    this.load()
  },
  load() {
    this.setData({ loading: true })
    myApi.myComments({ page: 0, size: 50 }).then(res => {
      let list = (res && res.data && res.data.content) ? res.data.content : []
      list = (list || []).map(c => ({ ...c, createTimeStr: formatTime(c.createTime) }))
      this.setData({ list, loading: false })
    }).catch((res) => {
      this.setData({ loading: false })
      if (res && res.statusCode === 404) {
        wx.showToast({ title: '请重新编译并启动 vote-backend', icon: 'none', duration: 2500 })
      }
    })
  },
  onItemTap(e) {
    const voteId = e.currentTarget.dataset.voteId
    if (voteId) wx.navigateTo({ url: '/pages/vote-detail/vote-detail?id=' + voteId })
  }
})
