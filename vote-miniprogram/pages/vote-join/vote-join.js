const voteApi = require('../../api/vote.js')

Page({
  data: {
    id: null,
    detail: {},
    options: [],
    selectedId: null,
    selectedIds: [],
    limitPerUser: 1
  },
  onLoad(opts) {
    const id = opts.id
    this.setData({ id })
    if (id) {
      voteApi.result(id).then(res => {
        const data = (res && res.data) ? res.data : res
        const vote = data.vote || data
        const raw = data.options || data.optionList || []
        const options = raw.map(o => ({ ...o, selected: false }))
        const limitPerUser = (vote.limitPerUser != null && vote.limitPerUser >= 1) ? vote.limitPerUser : 1
        this.setData({ detail: vote, options, limitPerUser })
      }).catch(() => {
        this.setData({ options: [] })
      })
    }
  },
  onSelectOption(e) {
    const id = e.currentTarget.dataset.id
    const limit = this.data.limitPerUser
    const options = this.data.options.slice()
    const idx = options.findIndex(o => o.id === id)
    if (idx < 0) return
    if (limit > 1) {
      const currentlySelected = options[idx].selected
      const selectedCount = options.filter(o => o.selected).length
      if (!currentlySelected && selectedCount >= limit) {
        wx.showToast({ title: '最多选' + limit + '项', icon: 'none' })
        return
      }
      options[idx].selected = !options[idx].selected
      const selectedIds = options.filter(o => o.selected).map(o => o.id)
      this.setData({ options, selectedIds, selectedId: null })
    } else {
      options.forEach((o, i) => { o.selected = (i === idx) })
      this.setData({ options, selectedId: id, selectedIds: [] })
    }
  },
  onSubmit() {
    const voteId = parseInt(this.data.id, 10)
    if (!voteId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      return
    }
    const limit = this.data.limitPerUser
    let toSubmit = []
    if (limit > 1) {
      toSubmit = (this.data.selectedIds || []).map(id => parseInt(id, 10)).filter(Boolean)
    } else {
      const sid = this.data.selectedId
      if (sid) toSubmit = [parseInt(sid, 10)]
    }
    if (toSubmit.length === 0) {
      wx.showToast({ title: limit > 1 ? '请至少选择一项' : '请选择一项', icon: 'none' })
      return
    }
    const submitOne = (optionId) => voteApi.submit({ voteId, optionId })
    const run = toSubmit.reduce((p, optionId) => p.then(() => submitOne(optionId)), Promise.resolve())
    run.then(() => {
      wx.showToast({ title: '投票成功', icon: 'success' })
      setTimeout(() => wx.redirectTo({ url: '/pages/vote-result/vote-result?id=' + this.data.id }), 1500)
    }).catch((res) => {
      const msg = (res && res.message) ? res.message : '投票失败'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    })
  }
})
