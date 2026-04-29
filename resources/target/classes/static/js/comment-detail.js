/**
 * 评论详情 - 对接 /api/admin/comment/detail、review、delete
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function formatTime(str) {
        if (!str) return '-';
        try {
            var d = new Date(str);
            return isNaN(d.getTime()) ? str : d.toLocaleString('zh-CN');
        } catch (e) { return str; }
    }

    var commentId = getQueryParam('id');
    if (!commentId) {
        document.getElementById('commentDetailError').textContent = '缺少评论ID';
        document.getElementById('commentDetailError').style.display = 'block';
    } else {
        if (!window.adminRequest) {
            document.getElementById('commentDetailError').textContent = '请先加载 request.js';
            document.getElementById('commentDetailError').style.display = 'block';
        } else {
            window.adminRequest.get('/api/admin/comment/detail/' + commentId).then(function (res) {
                if (res && res.code === 200 && res.data) {
                    var c = res.data;
                    document.getElementById('commentId').textContent = c.id;
                    var voteLink = document.getElementById('commentVoteIdLink');
                    voteLink.textContent = c.voteId;
                    voteLink.href = '/vote/detail?id=' + c.voteId;
                    document.getElementById('commentUserId').textContent = c.userId;
                    document.getElementById('commentContent').textContent = c.content || '-';
                    document.getElementById('commentLikeCount').textContent = c.likeCount != null ? c.likeCount : 0;
                    var statusMap = { 0: '待审核', 1: '已通过', 2: '已拒绝' };
                    document.getElementById('commentStatus').textContent = statusMap[c.status] != null ? statusMap[c.status] : ('状态' + c.status);
                    document.getElementById('commentCreateTime').textContent = formatTime(c.createTime);
                    document.getElementById('commentDetailBox').style.display = 'block';
                } else {
                    document.getElementById('commentDetailError').textContent = (res && res.message) ? res.message : '评论不存在';
                    document.getElementById('commentDetailError').style.display = 'block';
                }
            }).catch(function () {
                document.getElementById('commentDetailError').textContent = '请求失败';
                document.getElementById('commentDetailError').style.display = 'block';
            });
        }
    }

    function doReview(status) {
        if (!commentId || !window.adminRequest) return;
        window.adminRequest.put('/api/admin/comment/review/' + commentId + '?status=' + status).then(function (res) {
            if (res && res.code === 200) { alert('操作成功'); window.location.reload(); }
            else alert(res && res.message ? res.message : '操作失败');
        }).catch(function () { alert('请求失败'); });
    }

    function doDelete() {
        if (!commentId || !confirm('确定删除该评论？') || !window.adminRequest) return;
        window.adminRequest.delete('/api/admin/comment/delete/' + commentId).then(function (res) {
            if (res && res.code === 200) { alert('已删除'); window.location.href = '/comment/list'; }
            else alert(res && res.message ? res.message : '删除失败');
        }).catch(function () { alert('请求失败'); });
    }

    document.getElementById('btnCommentPass') && document.getElementById('btnCommentPass').addEventListener('click', function () { doReview(1); });
    document.getElementById('btnCommentReject') && document.getElementById('btnCommentReject').addEventListener('click', function () { doReview(2); });
    document.getElementById('btnCommentDelete') && document.getElementById('btnCommentDelete').addEventListener('click', doDelete);
})();
