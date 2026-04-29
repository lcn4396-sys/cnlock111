/**
 * 登录、token 存储与校验
 */
const { get } = require('./request.js')

function getToken() {
  return wx.getStorageSync('token') || ''
}

function setToken(token) {
  wx.setStorageSync('token', token || '')
}

function clearToken() {
  wx.removeStorageSync('token')
}

function isLoggedIn() {
  return !!getToken()
}

/** 微信登录（获取 code 后由后端换 openid/token，此处仅占位） */
function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          // 实际应调用后端 POST /api/mini/auth/login 用 code 换 token
          setToken('')
          resolve(res.code)
        } else reject(res)
      },
      fail: reject
    })
  })
}

module.exports = {
  getToken,
  setToken,
  clearToken,
  isLoggedIn,
  login
}
