/**
 * 封装 wx.request：统一 baseURL、token、错误处理
 */
const { getBaseURL, apiPrefix } = require('../config/env.js')

function buildUrl(url) {
  const baseURL = getBaseURL()
  return (url && url.startsWith('http')) ? url : baseURL + apiPrefix + (url || '')
}

function request(options) {
  const token = wx.getStorageSync('token') || ''
  const url = buildUrl(options.url)
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
        ...(options.header || {})
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const data = res.data
          if (data && data.code !== undefined && data.code !== 200) {
            wx.showToast({ title: data.message || '请求失败', icon: 'none' })
            reject(data)
          } else {
            resolve(data)
          }
        } else {
          if (res.statusCode === 401 || res.statusCode === 403) {
            wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          } else {
            wx.showToast({ title: '网络错误', icon: 'none' })
          }
          reject(res)
        }
      },
      fail(err) {
        wx.showToast({ title: (err && err.errMsg) ? '网络异常' : '请求失败', icon: 'none' })
        if (err && err.errMsg) console.error('request fail:', err.errMsg, 'url:', url)
        reject(err)
      }
    })
  })
}

module.exports = {
  get: (url, data) => request({ method: 'GET', url, data }),
  post: (url, data) => request({ method: 'POST', url, data }),
  put: (url, data) => request({ method: 'PUT', url, data }),
  del: (url, data) => request({ method: 'DELETE', url, data }),
  upload: (url, filePath, name = 'file', formData = {}) => {
    const token = wx.getStorageSync('token') || ''
    const fullUrl = buildUrl(url)
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: fullUrl,
        filePath,
        name,
        formData,
        header: {
          'Authorization': token ? 'Bearer ' + token : ''
        },
        success(res) {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            let msg = '上传失败'
            if (res.statusCode === 401 || res.statusCode === 403) msg = '请先登录'
            try {
              const errData = JSON.parse(res.data || '{}')
              if (errData && errData.message) msg = errData.message
            } catch (e) {
              if (typeof res.data === 'string' && res.data) msg = res.data
            }
            wx.showToast({ title: msg, icon: 'none' })
            console.error('upload http fail:', res.statusCode, 'url:', fullUrl, 'body:', res.data)
            reject(res)
            return
          }
          let data = {}
          try {
            data = JSON.parse(res.data || '{}')
          } catch (e) {
            wx.showToast({ title: '上传响应异常', icon: 'none' })
            reject(e)
            return
          }
          if (data && data.code !== undefined && data.code !== 200) {
            wx.showToast({ title: data.message || '上传失败', icon: 'none' })
            reject(data)
            return
          }
          resolve(data)
        },
        fail(err) {
          wx.showToast({ title: '上传失败', icon: 'none' })
          if (err && err.errMsg) console.error('upload fail:', err.errMsg, 'url:', fullUrl)
          reject(err)
        }
      })
    })
  },
  request
}
