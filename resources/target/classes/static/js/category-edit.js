/**
 * 分类编辑 - 对接 /api/admin/category（create / edit）
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function loadCategory(id) {
        if (!id || !window.adminRequest) return;
        window.adminRequest.get('/api/admin/category/list').then(function (res) {
            if (res && res.code === 200 && res.data) {
                var list = Array.isArray(res.data) ? res.data : [];
                var c = list.filter(function (x) { return String(x.id) === String(id); })[0];
                if (c) {
                    document.getElementById('categoryId').value = c.id;
                    document.getElementById('categoryName').value = c.name || '';
                    document.getElementById('categoryDesc').value = c.description || '';
                    document.getElementById('categorySort').value = c.sortOrder != null ? c.sortOrder : 0;
                    document.getElementById('categoryStatus').value = c.status != null ? c.status : 1;
                    var t = document.getElementById('categoryEditTitle');
                    if (t) t.textContent = '编辑分类';
                }
            }
        }).catch(function () {});
    }

    document.getElementById('categoryForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var id = document.getElementById('categoryId').value.trim();
        var name = document.getElementById('categoryName').value.trim();
        var desc = document.getElementById('categoryDesc').value.trim();
        var sortOrder = parseInt(document.getElementById('categorySort').value, 10) || 0;
        var status = parseInt(document.getElementById('categoryStatus').value, 10);
        if (!name) { alert('请填写分类名称'); return; }
        if (!window.adminRequest) { alert('请求未就绪'); return; }
        var body = { name: name, description: desc || null, sortOrder: sortOrder, status: status };
        if (id) {
            window.adminRequest.put('/api/admin/category/edit/' + id, body).then(function (res) {
                if (res && res.code === 200) { alert('保存成功'); window.location.href = '/category/list'; }
                else alert(res && res.message ? res.message : '保存失败');
            }).catch(function () { alert('请求失败'); });
        } else {
            window.adminRequest.post('/api/admin/category/create', body).then(function (res) {
                if (res && res.code === 200) { alert('新增成功'); window.location.href = '/category/list'; }
                else alert(res && res.message ? res.message : '新增失败');
            }).catch(function () { alert('请求失败'); });
        }
    });

    var id = getQueryParam('id');
    if (id) loadCategory(id);
    else document.getElementById('categoryEditTitle').textContent = '新增分类';
})();
