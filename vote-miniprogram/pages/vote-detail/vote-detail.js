const voteApi = require('../../api/vote.js')
const commentApi = require('../../api/comment.js')
const reportApi = require('../../api/report.js')

function formatCommentTime(str) {
  if (!str) return ''
  try {
    const d = new Date(str)
    if (isNaN(d.getTime())) return str
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) return '刚刚'
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return m + '-' + day + ' ' + h + ':' + min
  } catch (e) { return str }
}

Page({
  data: {
    id: null,
    detail: {},
    comments: [],
    commentContent: '',
    commentLoading: false,
    reportModalVisible: false,
    reportContent: ''
  },
  onLoad(opts) {
    const id = opts.id || opts.voteId
    this.setData({ id })
    if (id) {
      voteApi.detail(id).then(res => {
        const data = (res && res.data) ? res.data : res
        this.setData({ detail: data })
      }).catch(() => {})
      this.loadComments()
    }
  },
  loadComments() {
    const id = this.data.id
    if (!id) return
    this.setData({ commentLoading: true })
    commentApi.list(id, { page: 0, size: 50 }).then(res => {
      let list = (res && res.data && res.data.content) ? res.data.content : (Array.isArray(res && res.data) ? res.data : [])
      list = (list || []).map(c => ({ ...c, createTimeStr: formatCommentTime(c.createTime), liked: false }))
      this.setData({ comments: list, commentLoading: false })
    }).catch(() => this.setData({ comments: [], commentLoading: false }))
  },
  onCommentInput(e) {
    this.setData({ commentContent: e.detail.value })
  },
  onSendComment() {
    const content = (this.data.commentContent || '').trim()
    if (!content) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' })
      return
    }
    const voteId = parseInt(this.data.id, 10)
    if (!voteId) return
    this.setData({ commentContent: '' })
    commentApi.create({ voteId, content }).then((res) => {
      wx.showToast({ title: '评论成功', icon: 'success' })
      const newComment = (res && res.data) ? res.data : null
      if (newComment) {
        const item = { ...newComment, createTimeStr: '刚刚', liked: false }
        this.setData({ comments: [item].concat(this.data.comments) })
      } else {
        this.loadComments()
      }
    }).catch((res) => {
      const msg = (res && res.message) ? res.message : '评论失败，请先登录'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    })
  },
  onViewResult() {
    wx.navigateTo({ url: '/pages/vote-result/vote-result?id=' + this.data.id })
  },
  onJoin() {
    wx.navigateTo({ url: '/pages/vote-join/vote-join?id=' + this.data.id })
  },
  onShare() {
    wx.navigateTo({ url: '/pages/vote-share/vote-share?id=' + this.data.id })
  },
  onReport() {
    this.setData({ reportModalVisible: true, reportContent: '' })
  },
  onReportContentInput(e) {
    this.setData({ reportContent: e.detail.value })
  },
  onCloseReportModal() {
    this.setData({ reportModalVisible: false, reportContent: '' })
  },
  onBoxTapReport() {
    // 阻止点击弹窗内容时关闭
  },
  onSubmitReport() {
    const content = (this.data.reportContent || '').trim()
    if (!content) {
      wx.showToast({ title: '请填写举报原因', icon: 'none' })
      return
    }
    const voteId = parseInt(this.data.id, 10)
    if (!voteId) {
      wx.showToast({ title: '投票信息异常', icon: 'none' })
      return
    }
    reportApi.submit({
      reportType: 1,
      targetType: 'vote',
      targetId: voteId,
      content: content
    }).then(() => {
      this.setData({ reportModalVisible: false, reportContent: '' })
      wx.showToast({ title: '举报已提交', icon: 'success' })
    }).catch((res) => {
      const msg = (res && res.message) ? res.message : '提交失败，请先登录'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    })
  },
  onCommentLike(e) {
    const commentId = e.detail.commentId
    if (!commentId) return
    commentApi.like(commentId).then(() => {
      const comments = this.data.comments.map(c => {
        if (c.id !== commentId) return c
        const liked = !c.liked
        return { ...c, liked, likeCount: (c.likeCount || 0) + (liked ? 1 : -1) }
      })
      this.setData({ comments })
    }).catch((res) => {
      const msg = (res && res.message) ? res.message : '操作失败，请先登录'
      wx.showToast({ title: msg, icon: 'none' })
    })
  }
})
