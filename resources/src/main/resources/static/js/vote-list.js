/**
 * 投票列表页 - 对接 GET /api/admin/vote/list（vote-backend）
 */
(function () {
    'use strict';

    var STATUS_MAP = { 0: '草稿', 1: '已发布', 2: '已下架', 3: '已结束' };
    var page = 0;
    var size = 10;
    var totalElements = 0;

    function formatTime(str) {
        if (!str) return '-';
        try {
            var d = new Date(str);
            return isNaN(d.getTime()) ? str : d.getLocaleString('zh-CN');
        } catch (e) { return str; }
    }

    function renderTable(content) {
        var tbody = document.getElementById('voteListBody');
        var emptyEl = document.getElementById('voteListEmpty');
        var errEl = document.getElementById('voteListError');
        if (!tbody) return;
        errEl.style.display = 'none';
        emptyEl.style.display = 'none';
        if (!content || content.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">暂无数据</td></tr>';
            if (page === 0) emptyEl.style.display = 'block';
            return;
        }
        var html = content.map(function (v) {
            var statusText = STATUS_MAP[v.status] != null ? STATUS_MAP[v.status] : ('状态' + v.status);
            var time = formatTime(v.createTime);
            var statusBtn = v.status === 1
                ? '<button type="button" class="btn btn-sm btn-outline-warning me-1 btn-vote-status" data-id="' + v.id + '" data-status="2">下架</button>'
                : '<button type="button" class="btn btn-sm btn-outline-success me-1 btn-vote-status" data-id="' + v.id + '" data-status="1">发布</button>';
            return '<tr><td>' + (v.title || '-') + '</td><td>' + statusText + '</td><td>' + time + '</td><td>' +
                '<a href="/vote/detail?id=' + v.id + '" class="btn btn-sm btn-outline-primary me-1">详情</a>' +
                '<a href="/vote/result?id=' + v.id + '" class="btn btn-sm btn-outline-info me-1">结果</a>' +
                '<a href="/vote/edit?id=' + v.id + '" class="btn btn-sm btn-outline-secondary me-1">编辑</a>' +
                statusBtn +
                '<button type="button" class="btn btn-sm btn-outline-danger btn-delete-vote" data-id="' + v.id + '">删除</button></td></tr>';
        }).join('');
        tbody.innerHTML = html;

        [].forEach.call(document.querySelectorAll('.btn-vote-status'), function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                var status = parseInt(this.getAttribute('data-status'), 10);
                if (!id || !window.adminRequest) return;
                window.adminRequest.put('/api/admin/vote/status/' + id + '?status=' + status).then(function (res) {
                    if (res && res.code === 200) loadList(true);
                    else alert(res && res.message ? res.message : '操作失败');
                }).catch(function () { alert('请求失败'); });
            });
        });
        [].forEach.call(document.querySelectorAll('.btn-delete-vote'), function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                if (!id || !confirm('确定删除该投票？')) return;
                if (!window.adminRequest) return;
                window.adminRequest.delete('/api/admin/vote/delete/' + id).then(function (res) {
                    if (res && res.code === 200) {
                        loadList(true);
                    } else {
                        alert(res && res.message ? res.message : '删除失败');
                    }
                }).catch(function () { alert('删除请求失败'); });
            });
        });
    }

    function renderPager(total) {
        totalElements = total;
        var totalPages = size > 0 ? Math.ceil(total / size) : 0;
        var nav = document.getElementById('voteListPager');
        if (!nav || totalPages <= 1) {
            if (nav) nav.style.display = 'none';
            return;
        }
        nav.style.display = 'block';
        var cur = page + 1;
        var buf = '<ul class="pagination pagination-sm mb-0">';
        if (page > 0) buf += '<li class="page-item"><a class="page-link" href="#" data-page="' + (page - 1) + '">上一页</a></li>';
        buf += '<li class="page-item disabled"><span class="page-link">第 ' + cur + ' / ' + totalPages + ' 页</span></li>';
        if (page < totalPages - 1) buf += '<li class="page-item"><a class="page-link" href="#" data-page="' + (page + 1) + '">下一页</a></li>';
        buf += '</ul>';
        nav.innerHTML = buf;
        nav.querySelectorAll('a[data-page]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                page = parseInt(this.getAttribute('data-page'), 10);
                loadList(true);
            });
        });
    }

    function loadList(resetPage) {
        if (resetPage) page = 0;
        var tbody = document.getElementById('voteListBody');
        if (tbody && page === 0) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">加载中...</td></tr>';
        var errEl = document.getElementById('voteListError');
        if (errEl) errEl.style.display = 'none';

        var url = '/api/admin/vote/list?page=' + page + '&size=' + size;
        if (!window.adminRequest) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">请先加载 request.js</td></tr>';
            return;
        }
        window.adminRequest.get(url).then(function (res) {
            if (res && res.code === 200 && res.data) {
                var content = res.data.content || [];
                var total = res.data.totalElements != null ? res.data.totalElements : content.length;
                renderTable(content);
                renderPager(total);
            } else {
                renderTable([]);
                if (errEl) {
                    errEl.textContent = (res && res.message) ? res.message : '加载失败';
                    errEl.style.display = 'block';
                }
            }
        }).catch(function (err) {
            renderTable([]);
            if (errEl) {
                errEl.textContent = '请求失败，请确认 vote-backend 已启动（默认 http://localhost:8081）';
                errEl.style.display = 'block';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { loadList(true); });
    } else {
        loadList(true);
    }
})();
