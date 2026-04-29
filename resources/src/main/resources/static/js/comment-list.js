/**
 * 评论列表 - 对接 /api/admin/comment/list（vote-backend）
 */
(function () {
    'use strict';
    var page = 0;
    var size = 10;
    var totalElements = 0;

    function showError(msg) {
        var el = document.getElementById('commentListError');
        if (el) { el.textContent = msg || ''; el.style.display = msg ? 'block' : 'none'; }
    }

    function formatTime(str) {
        if (!str) return '-';
        try {
            var d = new Date(str);
            return isNaN(d.getTime()) ? str : d.toLocaleString('zh-CN');
        } catch (e) { return str; }
    }

    function renderTable(content) {
        var tbody = document.getElementById('commentListBody');
        if (!tbody) return;
        showError('');
        if (!content || content.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">暂无数据</td></tr>';
            return;
        }
        var statusMap = { 0: '待审核', 1: '已通过', 2: '已拒绝' };
        var html = content.map(function (c) {
            var statusText = statusMap[c.status] != null ? statusMap[c.status] : ('状态' + c.status);
            var contentShort = (c.content || '').substring(0, 40);
            if ((c.content || '').length > 40) contentShort += '…';
            return '<tr><td>' + (c.id || '-') + '</td><td>' + (c.voteId || '-') + '</td><td>' + (c.userId || '-') + '</td><td title="' + (c.content || '').replace(/"/g, '&quot;') + '">' + contentShort + '</td><td>' + formatTime(c.createTime) + '</td><td>' + statusText + '</td><td>' +
                '<a href="/comment/detail?id=' + c.id + '" class="btn btn-sm btn-outline-primary me-1">详情</a>' +
                '<button type="button" class="btn btn-sm btn-outline-success btn-comment-review me-1" data-id="' + c.id + '" data-status="1">通过</button>' +
                '<button type="button" class="btn btn-sm btn-outline-warning btn-comment-review me-1" data-id="' + c.id + '" data-status="2">拒绝</button>' +
                '<button type="button" class="btn btn-sm btn-outline-danger btn-comment-delete" data-id="' + c.id + '">删除</button></td></tr>';
        }).join('');
        tbody.innerHTML = html;

        tbody.querySelectorAll('.btn-comment-review').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                var status = parseInt(this.getAttribute('data-status'), 10);
                if (!id || !window.adminRequest) return;
                window.adminRequest.put('/api/admin/comment/review/' + id + '?status=' + status).then(function (res) {
                    if (res && res.code === 200) loadList(true);
                    else alert(res && res.message ? res.message : '操作失败');
                }).catch(function () { alert('请求失败'); });
            });
        });
        tbody.querySelectorAll('.btn-comment-delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                if (!id || !confirm('确定删除该评论？') || !window.adminRequest) return;
                window.adminRequest.delete('/api/admin/comment/delete/' + id).then(function (res) {
                    if (res && res.code === 200) loadList(true);
                    else alert(res && res.message ? res.message : '删除失败');
                }).catch(function () { alert('请求失败'); });
            });
        });
    }

    function renderPager(total) {
        totalElements = total;
        var totalPages = size > 0 ? Math.ceil(total / size) : 0;
        var nav = document.getElementById('commentListPager');
        if (!nav || totalPages <= 1) { if (nav) nav.style.display = 'none'; return; }
        nav.style.display = 'block';
        var cur = page + 1;
        var buf = '<ul class="pagination pagination-sm mb-0"><li class="page-item disabled"><span class="page-link">第 ' + cur + ' / ' + totalPages + ' 页</span></li>';
        if (page > 0) buf += '<li class="page-item"><a class="page-link" href="#" data-page="' + (page - 1) + '">上一页</a></li>';
        if (page < totalPages - 1) buf += '<li class="page-item"><a class="page-link" href="#" data-page="' + (page + 1) + '">下一页</a></li>';
        buf += '</ul>';
        nav.innerHTML = buf;
        nav.querySelectorAll('a[data-page]').forEach(function (a) {
            a.addEventListener('click', function (e) { e.preventDefault(); page = parseInt(this.getAttribute('data-page'), 10); loadList(true); });
        });
    }

    function loadList(resetPage) {
        if (resetPage) page = 0;
        var tbody = document.getElementById('commentListBody');
        if (tbody && page === 0) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">加载中...</td></tr>';
        showError('');
        if (!window.adminRequest) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">请先加载 request.js</td></tr>';
            return;
        }
        var url = '/api/admin/comment/list?page=' + page + '&size=' + size;
        window.adminRequest.get(url).then(function (res) {
            if (res && res.code === 200 && res.data) {
                var content = res.data.content || [];
                var total = res.data.totalElements != null ? res.data.totalElements : content.length;
                renderTable(content);
                renderPager(total);
            } else {
                renderTable([]);
                showError((res && res.message) ? res.message : '加载失败');
            }
        }).catch(function () {
            renderTable([]);
            showError('请求失败，请确认 vote-backend 已启动');
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { loadList(true); });
    else loadList(true);
})();
