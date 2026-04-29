const { getBaseURL, apiPrefix } = require('../config/env.js')

/**
 * 微信登录：用 code 换 token，并写入本地
 * 开发阶段可传 code='dev' 获取测试 token
 */
function login(code) {
  const baseURL = getBaseURL()
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + apiPrefix + '/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { code: code || 'dev' },
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 200 && res.data.data && res.data.data.token) {
          wx.setStorageSync('token', res.data.data.token)
          resolve(res.data.data.token)
        } else {
          const msg = (res.data && res.data.message) ? res.data.message : '登录失败'
          reject({ message: msg, data: res.data })
        }
      },
      fail: reject
    })
  })
}

/**
 * 先调 wx.login 取 code，再调后端换 token（正式环境用）
 * 新用户首次登录即视为注册，后端会自动创建用户
 */
function loginWithWx() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          login(res.code).then(resolve).catch(reject)
        } else {
          reject({ message: '获取微信登录态失败' })
        }
      },
      fail(err) {
        reject({ message: '微信登录失败', err })
      }
    })
  })
}

/**
 * 手机号快捷登录：使用 getPhoneNumber 返回的 code 调后端换 token
 * @param {string} code - button open-type="getPhoneNumber" 回调中的 detail.code
 */
function loginWithPhone(code) {
  const baseURL = getBaseURL()
  return new Promise((resolve, reject) => {
    if (!code) {
      reject({ message: '未获取到手机号授权' })
      return
    }
    wx.request({
      url: baseURL + apiPrefix + '/auth/login/phone',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { code: code },
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 200 && res.data.data && res.data.data.token) {
          wx.setStorageSync('token', res.data.data.token)
          resolve(res.data.data.token)
        } else {
          const msg = (res.data && res.data.message) ? res.data.message : '手机号登录失败'
          reject({ message: msg, data: res.data })
        }
      },
      fail: reject
    })
  })
}

module.exports = { login, loginWithWx, loginWithPhone }
