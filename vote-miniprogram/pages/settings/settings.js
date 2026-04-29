const userApi = require('../../api/user.js')

Page({
  data: {
    profile: {},
    oldPassword: '',
    newPassword: '',
    loading: false
  },
  onLoad() {
    this.loadProfile()
  },
  loadProfile() {
    this.setData({ loading: true })
    userApi.profile().then(res => {
      const profile = (res && res.data) ? res.data : {}
      this.setData({ profile, loading: false })
    }).catch(res => {
      this.setData({ loading: false })
      const msg = (res && res.message) ? res.message : (res.data && res.data.message) ? res.data.message : ''
      const needRelogin = (res && res.code === 401) || (res && res.statusCode === 401) ||
        (msg.indexOf('用户不存在') !== -1 || msg.indexOf('登录已失效') !== -1)
      if (needRelogin) {
        wx.removeStorageSync('token')
        wx.showToast({ title: '请重新登录', icon: 'none', duration: 2000 })
      }
    })
  },
  onNicknameInput(e) { this.setData({ 'profile.nickname': e.detail.value }) },
  onAvatarInput(e) { this.setData({ 'profile.avatarUrl': e.detail.value }) },
  onMobileInput(e) { this.setData({ 'profile.mobile': e.detail.value }) },
  onEmailInput(e) { this.setData({ 'profile.email': e.detail.value }) },
  onAddressInput(e) { this.setData({ 'profile.address': e.detail.value }) },
  onOldPwdInput(e) { this.setData({ oldPassword: e.detail.value }) },
  onNewPwdInput(e) { this.setData({ newPassword: e.detail.value }) },
  onSaveProfile() {
    const profile = this.data.profile
    const mobile = (profile.mobile || '').trim()
    if (mobile && !/^\d{11}$/.test(mobile)) {
      wx.showToast({ title: '手机号须为11位数字', icon: 'none' })
      return
    }
    userApi.profileEdit({
      nickname: profile.nickname,
      avatarUrl: profile.avatarUrl,
      mobile: mobile,
      email: profile.email,
      address: profile.address
    }).then(() => {
      wx.showToast({ title: '保存成功', icon: 'success' })
    }).catch(res => {
      const statusCode = (res && res.statusCode)
      if (statusCode === 401 || statusCode === 403) {
        wx.removeStorageSync('token')
        wx.showToast({ title: '登录已失效，请重新登录后再保存', icon: 'none', duration: 2000 })
        return
      }
      wx.showToast({ title: (res && res.message) || (res && res.data && res.data.message) || '保存失败', icon: 'none' })
    })
  },
  onChangePassword() {
    const { oldPassword, newPassword } = this.data
    if (!oldPassword || !newPassword) {
      wx.showToast({ title: '请填写原密码和新密码', icon: 'none' })
      return
    }
    if (newPassword.length < 6 || newPassword.length > 32) {
      wx.showToast({ title: '新密码需 6-32 位', icon: 'none' })
      return
    }
    userApi.password({ oldPassword, newPassword }).then(() => {
      wx.showToast({ title: '密码已修改', icon: 'success' })
      this.setData({ oldPassword: '', newPassword: '' })
    }).catch(res => {
      wx.showToast({ title: (res && res.message) || '修改失败', icon: 'none' })
    })
  }
})
