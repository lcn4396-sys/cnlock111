const { get } = require('../utils/request.js')

/** 分类列表 */
function list() {
  return get('/category/list')
}

module.exports = { list }
