/**
 * 投票详情（管理端）- 对接 /api/admin/vote/detail/{voteId}
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1]) : '';
    }

    var voteId = getQueryParam('id');
    if (!voteId) {
        document.getElementById('voteDetailError').textContent = '缺少投票ID';
        document.getElementById('voteDetailError').style.display = 'block';
    } else if (!window.adminRequest) {
        document.getElementById('voteDetailError').textContent = '请先加载 request.js';
        document.getElementById('voteDetailError').style.display = 'block';
    } else {
        window.adminRequest.get('/api/admin/vote/detail/' + voteId).then(function (res) {
            if (res && res.code === 200 && res.data) {
                var data = res.data;
                var vote = data.vote || {};
                var options = data.options || [];
                var statusMap = { 0: '草稿', 1: '已发布', 2: '已下架', 3: '已结束' };
                document.getElementById('voteDetailTitle').textContent = vote.title || '-';
                document.getElementById('voteDetailDesc').textContent = vote.description || '-';
                document.getElementById('voteDetailStatus').textContent = statusMap[vote.status] != null ? statusMap[vote.status] : ('状态' + vote.status);
                document.getElementById('voteDetailParticipantCount').textContent = vote.participantCount != null ? vote.participantCount : 0;
                var tbody = document.getElementById('voteDetailOptions');
                tbody.innerHTML = options.map(function (o) {
                    return '<tr><td>' + (o.optionTitle || '-') + '</td><td>' + (o.voteCount != null ? o.voteCount : 0) + '</td></tr>';
                }).join('');
                document.getElementById('voteDetailResultLink').href = '/vote/result?id=' + voteId;
                document.getElementById('voteDetailEditLink').href = '/vote/edit?id=' + voteId;
                document.getElementById('voteDetailBox').style.display = 'block';
            } else {
                document.getElementById('voteDetailError').textContent = (res && res.message) ? res.message : '投票不存在';
                document.getElementById('voteDetailError').style.display = 'block';
            }
        }).catch(function () {
            document.getElementById('voteDetailError').textContent = '请求失败，请确认 vote-backend 已启动';
            document.getElementById('voteDetailError').style.display = 'block';
        });
    }
})();
