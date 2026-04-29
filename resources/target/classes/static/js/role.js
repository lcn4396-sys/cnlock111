/**
 * 角色管理页 - 对接 /api/admin/role（vote-backend）
 * list, create, edit, delete, assign
 */
(function () {
    'use strict';

    var modalEl = document.getElementById('roleFormModal');
    var modalTitle = document.getElementById('roleFormModalTitle');
    var formId = document.getElementById('roleFormId');
    var formName = document.getElementById('roleFormName');
    var formCode = document.getElementById('roleFormCode');
    var formDesc = document.getElementById('roleFormDesc');
    var formStatus = document.getElementById('roleFormStatus');
    var formStatusWrap = document.getElementById('roleFormStatusWrap');

    function showError(msg) {
        var el = document.getElementById('roleListError');
        if (el) {
            el.textContent = msg || '';
            el.style.display = msg ? 'block' : 'none';
        }
    }

    function renderTable(list) {
        var tbody = document.getElementById('roleListBody');
        if (!tbody) return;
        showError('');
        if (!list || list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">暂无数据</td></tr>';
            return;
        }
        var statusText = function (s) { return s === 1 ? '启用' : '禁用'; };
        var html = list.map(function (r) {
            return '<tr><td>' + (r.roleName || '-') + '</td><td><code>' + (r.roleCode || '-') + '</code></td><td>' +
                (r.description || '-') + '</td><td>' + statusText(r.status) + '</td><td>' +
                '<button type="button" class="btn btn-sm btn-outline-secondary btn-role-edit me-1" data-id="' + r.id + '" data-name="' + (r.roleName || '').replace(/"/g, '&quot;') + '" data-code="' + (r.roleCode || '').replace(/"/g, '&quot;') + '" data-desc="' + (r.description || '').replace(/"/g, '&quot;') + '" data-status="' + (r.status != null ? r.status : 1) + '">编辑</button>' +
                '<button type="button" class="btn btn-sm btn-outline-info btn-role-assign me-1" data-id="' + r.id + '">分配权限</button>' +
                '<button type="button" class="btn btn-sm btn-outline-danger btn-role-delete" data-id="' + r.id + '" data-name="' + (r.roleName || '').replace(/"/g, '&quot;') + '">删除</button></td></tr>';
        }).join('');
        tbody.innerHTML = html;

        [].forEach.call(document.querySelectorAll('.btn-role-edit'), function (btn) {
            btn.addEventListener('click', function () {
                openModalEdit(this.getAttribute('data-id'), this.getAttribute('data-name'), this.getAttribute('data-code'), this.getAttribute('data-desc'), this.getAttribute('data-status'));
            });
        });
        [].forEach.call(document.querySelectorAll('.btn-role-assign'), function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                if (!window.adminRequest) return;
                window.adminRequest.put('/api/admin/role/assign/' + id, []).then(function (res) {
                    if (res && res.code === 200) alert('分配权限已保存（当前为占位实现）');
                    else alert(res && res.message ? res.message : '操作失败');
                }).catch(function () { alert('请求失败'); });
            });
        });
        [].forEach.call(document.querySelectorAll('.btn-role-delete'), function (btn) {
            btn.addEventListener('click', function () {
                var id = this.getAttribute('data-id');
                var name = this.getAttribute('data-name') || '该角色';
                if (!confirm('确定删除角色「' + name + '」？')) return;
                if (!window.adminRequest) return;
                window.adminRequest.delete('/api/admin/role/delete/' + id).then(function (res) {
                    if (res && res.code === 200) loadList();
                    else alert(res && res.message ? res.message : '删除失败');
                }).catch(function () { alert('删除请求失败'); });
            });
        });
    }

    function loadList() {
        var tbody = document.getElementById('roleListBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">加载中...</td></tr>';
        showError('');
        if (!window.adminRequest) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">请先加载 request.js</td></tr>';
            return;
        }
        window.adminRequest.get('/api/admin/role/list').then(function (res) {
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

    function openModalAdd() {
        formId.value = '';
        formName.value = '';
        formCode.value = '';
        formDesc.value = '';
        if (formStatus) formStatus.value = '1';
        if (formCode) formCode.disabled = false;
        if (modalTitle) modalTitle.textContent = '新增角色';
        if (formStatusWrap) formStatusWrap.style.display = 'none';
        if (modalEl) {
            var modal = new (window.bootstrap && window.bootstrap.Modal)(modalEl);
            modal.show();
        }
    }

    function openModalEdit(id, name, code, desc, status) {
        formId.value = id || '';
        formName.value = name || '';
        formCode.value = code || '';
        formDesc.value = desc || '';
        if (formStatus) formStatus.value = (status !== undefined && status !== '') ? status : '1';
        if (formCode) formCode.disabled = true;
        if (modalTitle) modalTitle.textContent = '编辑角色';
        if (formStatusWrap) formStatusWrap.style.display = 'block';
        if (modalEl) {
            var modal = new (window.bootstrap && window.bootstrap.Modal)(modalEl);
            modal.show();
        }
    }

    function submitForm() {
        var id = formId.value ? formId.value.trim() : '';
        var name = (formName && formName.value) ? formName.value.trim() : '';
        var code = (formCode && formCode.value) ? formCode.value.trim() : '';
        var desc = (formDesc && formDesc.value) ? formDesc.value.trim() : null;
        var status = formStatus && formStatus.value ? parseInt(formStatus.value, 10) : 1;
        if (!name) {
            alert('请填写角色名称');
            return;
        }
        if (!code) {
            alert('请填写角色编码');
            return;
        }
        if (!window.adminRequest) {
            alert('请求未就绪');
            return;
        }
        var body = { roleName: name, roleCode: code, description: desc, status: status };
        if (id) {
            window.adminRequest.put('/api/admin/role/edit/' + id, body).then(function (res) {
                if (res && res.code === 200) {
                    if (modalEl && window.bootstrap) { var m = window.bootstrap.Modal.getInstance(modalEl); if (m) m.hide(); }
                    loadList();
                } else {
                    alert((res && res.message) ? res.message : '保存失败');
                }
            }).catch(function () { alert('请求失败'); });
        } else {
            window.adminRequest.post('/api/admin/role/create', body).then(function (res) {
                if (res && res.code === 200) {
                    if (modalEl && window.bootstrap) { var m = window.bootstrap.Modal.getInstance(modalEl); if (m) m.hide(); }
                    loadList();
                } else {
                    alert((res && res.message) ? res.message : '新增失败');
                }
            }).catch(function () { alert('请求失败'); });
        }
    }

    if (document.getElementById('btnRoleAdd')) {
        document.getElementById('btnRoleAdd').addEventListener('click', openModalAdd);
    }
    if (document.getElementById('roleFormSubmit')) {
        document.getElementById('roleFormSubmit').addEventListener('click', submitForm);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadList);
    } else {
        loadList();
    }
})();
