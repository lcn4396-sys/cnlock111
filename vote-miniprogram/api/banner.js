const { get } = require('../utils/request.js')

/** 轮播图列表 */
function list() {
  return get('/banner/list')
}

module.exports = { list }
