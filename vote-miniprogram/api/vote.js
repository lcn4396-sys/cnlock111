const { get, post, upload } = require('../utils/request.js')

/** 投票列表 */
function list(params) {
  return get('/vote/list', params)
}

/** 投票详情 */
function detail(id) {
  return get('/vote/detail/' + id)
}

/** 投票结果 */
function result(id) {
  return get('/vote/result/' + id)
}

/** 排行榜 */
function rank(id) {
  return get('/vote/rank/' + id)
}

/** 创建投票（需登录） */
function create(data) {
  return post('/vote/create', data)
}

/** 上传投票封面（需登录） */
function uploadCover(filePath) {
  return upload('/vote/upload_cover', filePath, 'file')
}

/** 参与投票/提交选择 */
function submit(data) {
  return post('/vote/submit', data)
}

/** 我创建的投票 */
function myCreated(params) {
  return get('/vote/my_created', params || {})
}

/** 我参与的投票 */
function myJoined(params) {
  return get('/vote/my_joined', params || {})
}

module.exports = { list, detail, result, rank, create, uploadCover, submit, myCreated, myJoined }
