/**
 * 用户详情 - 对接 /api/admin/user/detail、edit、status、reset_password
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function loadUser(id) {
        if (!id || !window.adminRequest) return;
        document.getElementById('userDetailError').style.display = 'none';
        window.adminRequest.get('/api/admin/user/detail/' + id).then(function (res) {
            if (res && res.code === 200 && res.data) {
                var u = res.data;
                document.getElementById('userId').value = u.id;
                document.getElementById('userIdReadonly').value = u.id;
                document.getElementById('userNickname').value = u.nickname || '';
                document.getElementById('userMobile').value = u.mobile || '';
                document.getElementById('userEmail').value = u.email || '';
                document.getElementById('userStatus').value = u.status != null ? u.status : 1;
            } else {
                document.getElementById('userDetailError').textContent = (res && res.message) ? res.message : '用户不存在';
                document.getElementById('userDetailError').style.display = 'block';
            }
        }).catch(function () {
            document.getElementById('userDetailError').textContent = '请求失败，请确认 vote-backend 已启动';
            document.getElementById('userDetailError').style.display = 'block';
        });
    }

    document.getElementById('userDetailForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var id = document.getElementById('userId').value.trim();
        if (!id || !window.adminRequest) return;
        var body = {
            nickname: document.getElementById('userNickname').value.trim() || null,
            mobile: document.getElementById('userMobile').value.trim() || null,
            email: document.getElementById('userEmail').value.trim() || null,
            status: parseInt(document.getElementById('userStatus').value, 10)
        };
        window.adminRequest.put('/api/admin/user/edit/' + id, body).then(function (res) {
            if (res && res.code === 200) alert('保存成功');
            else alert(res && res.message ? res.message : '保存失败');
        }).catch(function () { alert('请求失败'); });
    });

    document.getElementById('btnResetPwd').addEventListener('click', function () {
        var id = document.getElementById('userId').value.trim();
        var pwd = prompt('请输入新密码（6-32位）');
        if (pwd == null) return;
        if (pwd.length < 6 || pwd.length > 32) { alert('密码需 6-32 位'); return; }
        if (!id || !window.adminRequest) return;
        window.adminRequest.put('/api/admin/user/reset_password/' + id + '?newPassword=' + encodeURIComponent(pwd)).then(function (res) {
            if (res && res.code === 200) alert('密码已重置');
            else alert(res && res.message ? res.message : '重置失败');
        }).catch(function () { alert('请求失败'); });
    });

    var id = getQueryParam('id');
    if (id) loadUser(id);
    else {
        document.getElementById('userDetailError').textContent = '缺少用户ID';
        document.getElementById('userDetailError').style.display = 'block';
    }
})();
