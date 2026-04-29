const voteApi = require('../../api/vote.js')
const categoryApi = require('../../api/category.js')
const auth = require('../../utils/auth.js')

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function timeStr() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${min}`
}
function combineDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return ''
  return dateStr + ' ' + timeStr
}

const LIMIT_OPTIONS = []
for (let i = 1; i <= 10; i++) {
  LIMIT_OPTIONS.push({ value: i, label: i === 1 ? '1项（单选）' : i + '项（多选）' })
}

Page({
  data: {
    title: '',
    desc: '',
    categoryList: [],
    categoryIndex: -1,
    categoryId: null,
    startDate: '',
    startTimePart: '',
    startTime: '',
    endDate: '',
    endTimePart: '',
    endTime: '',
    minDate: todayStr(),
    maxDate: '',
    options: ['', ''],
    limitOptions: LIMIT_OPTIONS,
    limitIndex: 0,
    limitPerUser: 1,
    coverImage: '',
    uploadingCover: false
  },
  onLoad() {
    const today = todayStr()
    const d = new Date()
    d.setFullYear(d.getFullYear() + 10)
    const maxDate = d.getFullYear() + '-12-31'
    this.setData({ minDate: today, maxDate })
    this.loadCategory()
  },
  loadCategory() {
    categoryApi.list().then(res => {
      const list = (res && res.data) ? res.data : []
      this.setData({ categoryList: list })
    }).catch(() => {})
  },
  onCategoryChange(e) {
    const idx = parseInt(e.detail.value, 10)
    const list = this.data.categoryList
    const item = list[idx]
    this.setData({
      categoryIndex: idx,
      categoryId: item ? item.id : null
    })
  },
  onTitleInput(e) { this.setData({ title: e.detail.value }) },
  onDescInput(e) { this.setData({ desc: e.detail.value }) },
  onStartDateChange(e) {
    const startDate = e.detail.value
    const startTime = combineDateTime(startDate, this.data.startTimePart)
    this.setData({ startDate, startTime })
  },
  onStartTimePartChange(e) {
    const startTimePart = e.detail.value
    const startTime = combineDateTime(this.data.startDate, startTimePart)
    this.setData({ startTimePart, startTime })
  },
  onEndDateChange(e) {
    const endDate = e.detail.value
    const endTime = combineDateTime(endDate, this.data.endTimePart)
    this.setData({ endDate, endTime })
  },
  onEndTimePartChange(e) {
    const endTimePart = e.detail.value
    const endTime = combineDateTime(this.data.endDate, endTimePart)
    this.setData({ endTimePart, endTime })
  },
  onOptionInput(e) {
    const idx = e.currentTarget.dataset.index
    const opts = this.data.options.slice()
    opts[idx] = e.detail.value
    this.setData({ options: opts })
  },
  onAddOption() {
    const opts = this.data.options.concat([''])
    this.setData({ options: opts })
  },
  onRemoveOption(e) {
    const idx = e.currentTarget.dataset.index
    const opts = this.data.options.filter((_, i) => i !== idx)
    if (opts.length < 2) return
    this.setData({ options: opts })
  },
  onLimitChange(e) {
    const idx = parseInt(e.detail.value, 10)
    const item = LIMIT_OPTIONS[idx]
    this.setData({ limitIndex: idx, limitPerUser: item ? item.value : 1 })
  },
  onChooseCover() {
    if (this.data.uploadingCover) return
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录后上传', icon: 'none' })
      return
    }
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const file = res && res.tempFiles && res.tempFiles[0]
        const filePath = file && file.tempFilePath
        if (!filePath) {
          wx.showToast({ title: '请选择图片', icon: 'none' })
          return
        }
        this.setData({ uploadingCover: true })
        voteApi.uploadCover(filePath).then((uploadRes) => {
          const imageUrl = (uploadRes && uploadRes.data) ? uploadRes.data : ''
          if (!imageUrl) {
            wx.showToast({ title: '上传失败', icon: 'none' })
            return
          }
          this.setData({ coverImage: imageUrl })
          wx.showToast({ title: '上传成功', icon: 'success' })
        }).catch(() => {}).finally(() => {
          this.setData({ uploadingCover: false })
        })
      }
    })
  },
  onRemoveCover() {
    this.setData({ coverImage: '' })
  },
  onSubmit() {
    const { title, options, categoryId, categoryList } = this.data
    if (!title || !title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    if (categoryList.length > 0 && (categoryId == null || categoryId === '')) {
      wx.showToast({ title: '请选择投票分类', icon: 'none' })
      return
    }
    const optionTitles = options.filter(o => o && o.trim()).map(o => o.trim())
    if (optionTitles.length < 2) {
      wx.showToast({ title: '至少两个选项', icon: 'none' })
      return
    }
    const { startTime, endTime, limitPerUser } = this.data
    const payload = { title: title.trim(), optionTitles, limitPerUser: limitPerUser || 1 }
    if (categoryId != null && categoryId !== '') payload.categoryId = categoryId
    if (this.data.desc && this.data.desc.trim()) payload.description = this.data.desc.trim()
    if (this.data.coverImage) payload.coverImage = this.data.coverImage
    if (startTime) payload.startTime = startTime
    if (endTime) payload.endTime = endTime
    voteApi.create(payload).then(() => {
      wx.showToast({ title: '创建成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }).catch(() => wx.showToast({ title: '创建失败', icon: 'none' }))
  }
})
