const voteApi = require('../../api/vote.js')
const { getBaseURL } = require('../../config/env.js')

Page({
  data: {
    id: null,
    detail: {},
    options: [],
    coverImageSrc: ''
  },
  normalizeCoverUrl(url) {
    if (!url) return ''
    // 兼容历史数据：旧版保存的是 /uploads/vote/xxx，转为新接口 /api/mini/vote/cover/xxx
    const match = url.match(/\/uploads\/vote\/([^/?#]+)/)
    if (match && match[1]) {
      return getBaseURL() + '/api/mini/vote/cover/' + match[1]
    }
    return url
  },
  normalizeImageSrc(url) {
    if (!url) return ''
    const normalizedUrl = this.normalizeCoverUrl(url)
    if (!normalizedUrl) return ''
    if (normalizedUrl.startsWith('https://') || normalizedUrl.startsWith('/') || normalizedUrl.startsWith('data:') || normalizedUrl.startsWith('wxfile://')) {
      return Promise.resolve(normalizedUrl)
    }
    if (!normalizedUrl.startsWith('http://')) return Promise.resolve(normalizedUrl)
    // wx-image 对 HTTP 链接限制更严格，先下载到本地临时文件再渲染。
    return new Promise((resolve) => {
      wx.downloadFile({
        url: normalizedUrl,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300 && res.tempFilePath) {
            resolve(res.tempFilePath)
            return
          }
          resolve('')
        },
        fail: () => resolve('')
      })
    })
  },
  onLoad(opts) {
    const id = opts.id
    this.setData({ id })
    if (id) {
      voteApi.result(id).then(res => {
        const data = (res && res.data) ? res.data : res
        const vote = (data && data.vote) ? data.vote : (data || {})
        const options = (data && (data.options || data.optionList))
          || vote.options
          || vote.optionList
          || []
        const coverImage = vote.coverImage || data.coverImage || ''
        this.normalizeImageSrc(coverImage).then((coverImageSrc) => {
          this.setData({
            detail: vote,
            options,
            coverImageSrc
          })
        })
      }).catch(() => {})
    }
  },
  onConfirm() {
    wx.navigateBack()
  }
})
