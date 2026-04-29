const { get, post } = require('../utils/request.js')

/** 评论列表 */
function list(voteId, params) {
  return get('/comment/list', { voteId, ...params })
}

/** 发表评论 */
function create(data) {
  return post('/comment/create', data)
}

/** 评论点赞/取消点赞 */
function like(commentId) {
  return post('/comment/like/' + commentId)
}

module.exports = { list, create, like }
