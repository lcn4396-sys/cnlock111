const { get, post, put } = require('../utils/request.js')

/** 当前用户信息/个人资料 */
function profile() {
  return get('/user/profile')
}

/** 修改个人资料 */
function profileEdit(data) {
  return put('/user/profile/edit', data)
}

/** 修改密码 */
function password(data) {
  return put('/user/password', data)
}

/** 退出登录 */
function logout() {
  return post('/user/logout')
}

module.exports = { profile, profileEdit, password, logout }
