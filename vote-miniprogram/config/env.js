/**
 * 环境与 API 基础地址
 */
const DEFAULT_BASE_URL = 'http://localhost:8081'
const STORAGE_KEY = 'dev_base_url'

function getBaseURL() {
  // 支持在开发者工具中通过 storage 覆盖，便于真机调试时改为电脑局域网 IP。
  if (typeof wx !== 'undefined' && wx.getStorageSync) {
    const custom = (wx.getStorageSync(STORAGE_KEY) || '').trim()
    if (custom) return custom
  }
  return DEFAULT_BASE_URL
}

module.exports = {
  baseURL: DEFAULT_BASE_URL,
  apiPrefix: '/api/mini',
  getBaseURL,
  storageKey: STORAGE_KEY
}
