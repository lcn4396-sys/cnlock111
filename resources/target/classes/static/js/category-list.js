/**
 * 分类列表 - 对接 /api/admin/category（vote-backend）
 */
(function () {
    'use strict';

    function showError(msg) {
        var el = document.getElementById('categoryListError');
        if (el) { el.textContent = msg || ''; el.style.display = msg ? 'block' : 'none'; }
    }

    function renderTable(list) {
        var tbody = document.getElementById('categoryListBody');
        if (!tbody) return;
        showError('');
        if (!list || list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">暂无数据</td></tr>';
            return;
        }
        var html = list.map(function (c) {
            var statusText = c.status === 1 ? '启用' : '禁用';
            return '<tr><td>' + (c.name || '-') + '</td><td>' + (c.description || '-').substring(0, 30) + '</td><td>' + (c.sortOrder != null ? c.sortOrder : 0) + '</td><td>' + statusText + '</td><td>' +
                '<a href="/category/edit?id=' + c.id + '" class="btn btn-sm btn-outline-primary me-1">编辑</a>' +
                '<button type="button" class="btn btn-sm btn-outline-warning btn-cat-status me-1" data-id="' + c.id + '" data-status="' + (c.status === 1 ? 0 : 1) + '">' + (c.status === 1 ? '禁用' : '启用') + '</button>' +
                '<button type="button" class="btn btn-sm btn-outline-danger btn-cat-delete" data-id="' + c.id + '" data-name="' + (c.name || '').replace(/"/g, '&quot;') + '">删除</button></td></tr>';
        }).join('');
        tbody.innerHTML = html;

        tbody.querySelectorAll('.btn-cat-status').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                var status = parseInt(this.getAttribute('data-status'), 10);
                if (!id || !window.adminRequest) return;
                window.adminRequest.put('/api/admin/category/status/' + id + '?status=' + status).then(function (res) {
                    if (res && res.code === 200) loadList();
                    else alert(res && res.message ? res.message : '操作失败');
                }).catch(function () { alert('请求失败'); });
            });
        });
        tbody.querySelectorAll('.btn-cat-delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                var name = this.getAttribute('data-name') || '该分类';
                if (!id || !confirm('确定删除「' + name + '」？')) return;
                if (!window.adminRequest) return;
                window.adminRequest.delete('/api/admin/category/delete/' + id).then(function (res) {
                    if (res && res.code === 200) loadList();
                    else alert(res && res.message ? res.message : '删除失败');
                }).catch(function () { alert('请求失败'); });
            });
        });
    }

    function loadList() {
        var tbody = document.getElementById('categoryListBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">加载中...</td></tr>';
        showError('');
        if (!window.adminRequest) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">请先加载 request.js</td></tr>';
            return;
        }
        window.adminRequest.get('/api/admin/category/list').then(function (res) {
            if (res && res.code === 200 && res.data) {
                renderTable(Array.isArray(res.data) ? res.data : []);
            } else {
                renderTable([]);
                showError((res && res.message) ? res.message : '加载失败');
            }
        }).catch(function () {
            renderTable([]);
            showError('请求失败，请确认 vote-backend 已启动（http://localhost:8081）');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadList);
    } else {
        loadList();
    }
})();
