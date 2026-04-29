/**
 * 举报列表 - 对接 /api/admin/report/list（vote-backend）
 */
(function () {
    'use strict';
    var page = 0;
    var size = 10;
    var totalElements = 0;
    var statusFilter = '';

    function showError(msg) {
        var el = document.getElementById('reportListError');
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
        var tbody = document.getElementById('reportListBody');
        if (!tbody) return;
        showError('');
        if (!content || content.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">暂无数据</td></tr>';
            return;
        }
        var typeMap = { 1: '举报', 2: '投诉' };
        var html = content.map(function (r) {
            var typeText = typeMap[r.reportType] != null ? typeMap[r.reportType] : ('类型' + r.reportType);
            var statusText = r.status === 1 ? '已处理' : '待处理';
            var target = (r.targetType || '') + '#' + (r.targetId || '');
            var contentShort = (r.content || '').substring(0, 30);
            if ((r.content || '').length > 30) contentShort += '…';
            return '<tr><td>' + (r.id || '-') + '</td><td>' + typeText + '</td><td>' + target + '</td><td>' + (r.reporterId || '-') + '</td><td title="' + (r.content || '').replace(/"/g, '&quot;') + '">' + contentShort + '</td><td>' + statusText + '</td><td>' + formatTime(r.createTime) + '</td><td>' +
                '<a href="/report/detail?id=' + r.id + '" class="btn btn-sm btn-outline-primary me-1">详情/处理</a></td></tr>';
        }).join('');
        tbody.innerHTML = html;
    }

    function renderPager(total) {
        totalElements = total;
        var totalPages = size > 0 ? Math.ceil(total / size) : 0;
        var nav = document.getElementById('reportListPager');
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
        var tbody = document.getElementById('reportListBody');
        if (tbody && page === 0) tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">加载中...</td></tr>';
        showError('');
        if (!window.adminRequest) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">请先加载 request.js</td></tr>';
            return;
        }
        var url = '/api/admin/report/list?page=' + page + '&size=' + size;
        if (statusFilter !== '') url += '&status=' + statusFilter;
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

    var filterEl = document.getElementById('reportStatusFilter');
    if (filterEl) filterEl.addEventListener('change', function () { statusFilter = this.value; loadList(true); });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { loadList(true); });
    else loadList(true);
})();
