/**
 * 个人设置 - 对接 /api/admin/profile、profile/edit、profile/password
 */
(function () {
    'use strict';

    function loadProfile() {
        if (!window.adminRequest) return;
        document.getElementById('profileError').style.display = 'none';
        window.adminRequest.get('/api/admin/profile').then(function (res) {
            if (res && res.code === 200 && res.data) {
                var u = res.data;
                document.getElementById('profileUsername').value = u.username || '';
                document.getElementById('profileNickname').value = u.nickname || '';
                document.getElementById('profileMobile').value = u.mobile || '';
                document.getElementById('profileEmail').value = u.email || '';
            } else {
                document.getElementById('profileError').textContent = (res && res.message) ? res.message : '未登录或加载失败';
                document.getElementById('profileError').style.display = 'block';
            }
        }).catch(function () {
            document.getElementById('profileError').textContent = '请求失败，请确认 vote-backend 已启动';
            document.getElementById('profileError').style.display = 'block';
        });
    }

    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        if (!window.adminRequest) return;
        var body = {
            nickname: document.getElementById('profileNickname').value.trim() || null,
            mobile: document.getElementById('profileMobile').value.trim() || null,
            email: document.getElementById('profileEmail').value.trim() || null
        };
        window.adminRequest.put('/api/admin/profile/edit', body).then(function (res) {
            if (res && res.code === 200) alert('保存成功');
            else alert(res && res.message ? res.message : '保存失败');
        }).catch(function () { alert('请求失败'); });
    });

    document.getElementById('profilePwdForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var oldPwd = document.getElementById('profileOldPwd').value;
        var newPwd = document.getElementById('profileNewPwd').value;
        if (!oldPwd || !newPwd) { alert('请填写原密码和新密码'); return; }
        if (newPwd.length < 6) { alert('新密码至少6位'); return; }
        if (!window.adminRequest) return;
        var url = '/api/admin/profile/password?oldPassword=' + encodeURIComponent(oldPwd) + '&newPassword=' + encodeURIComponent(newPwd);
        window.adminRequest.put(url).then(function (res) {
            if (res && res.code === 200) { alert('密码已修改'); document.getElementById('profileOldPwd').value = ''; document.getElementById('profileNewPwd').value = ''; }
            else alert(res && res.message ? res.message : '修改失败');
        }).catch(function () { alert('请求失败'); });
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadProfile);
    else loadProfile();
})();
