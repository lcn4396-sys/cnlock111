const { post } = require('../utils/request.js')

/**
 * 提交举报/投诉
 * data: { reportType: 1|2, targetType: 'vote'|'comment'|'user', targetId: number, content: string }
 */
function submit(data) {
  return post('/report/create', data)
}

module.exports = { submit }
