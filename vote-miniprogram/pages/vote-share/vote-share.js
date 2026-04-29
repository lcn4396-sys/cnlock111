const voteApi = require('../../api/vote.js')
const { getBaseURL } = require('../../config/env.js')

function sharePath(id) {
  return '/pages/vote-detail/vote-detail?id=' + id
}

/** 分享卡片配图需可访问的网络地址；相对路径补全为当前环境 baseURL */
function resolveShareImageUrl(path) {
  if (!path || typeof path !== 'string') return ''
  const p = path.trim()
  if (/^https?:\/\//i.test(p)) return p
  const base = getBaseURL().replace(/\/$/, '')
  return base + (p.startsWith('/') ? p : '/' + p)
}

Page({
  data: {
    id: null,
    detail: {}
  },
  onLoad(opts) {
    const id = opts.id
    this.setData({ id })
    if (id) {
      voteApi.detail(id).then(res => {
        const data = (res && res.data) ? res.data : res
        this.setData({ detail: data || {} })
      }).catch(() => {})
    }
  },
  onShow() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 从朋友圈入口打开本页时，直接进入投票详情（朋友圈分享只能带当前页 path + query）
    const id = this.data.id
    if (id && typeof wx.getEnterOptionsSync === 'function') {
      try {
        const opt = wx.getEnterOptionsSync()
        if (opt && opt.scene === 1154) {
          wx.redirectTo({ url: sharePath(id) })
        }
      } catch (e) {}
    }
  },
  onShareAppMessage() {
    const id = this.data.id
    const title = (this.data.detail && this.data.detail.title)
      ? this.data.detail.title
      : '邀请你参与投票'
    const imageUrl = resolveShareImageUrl((this.data.detail && this.data.detail.coverImage) || '')
    return {
      title,
      path: id ? sharePath(id) : '/pages/index/index',
      imageUrl: imageUrl || undefined
    }
  },
  onShareTimeline() {
    const id = this.data.id
    const title = (this.data.detail && this.data.detail.title)
      ? this.data.detail.title
      : '邀请你参与投票'
    const imageUrl = resolveShareImageUrl((this.data.detail && this.data.detail.coverImage) || '')
    return {
      title,
      query: id ? 'id=' + id : '',
      imageUrl: imageUrl || undefined
    }
  },
  onShare() {
    wx.showToast({ title: '请点击右上角「…」转发', icon: 'none' })
  }
})
