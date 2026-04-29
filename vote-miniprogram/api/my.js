const { get } = require('../utils/request.js')

/** 我的数据汇总（创建/参与/评论/举报数量） */
function actions() {
  return get('/my/actions')
}

/** 我的评论列表 */
function myComments(params) {
  return get('/my/comments', params || {})
}

/** 我的举报列表 */
function myReports(params) {
  return get('/my/reports', params || {})
}

module.exports = { actions, myComments, myReports }
