/**
 * 平台设置 - 对接 /api/admin/setting（GET 获取、PUT 保存）
 */
(function () {
    'use strict';

    function loadSettings() {
        if (!window.adminRequest) return;
        document.getElementById('settingError').style.display = 'none';
        window.adminRequest.get('/api/admin/setting').then(function (res) {
            if (res && res.code === 200 && res.data) {
                var data = res.data;
                document.getElementById('settingNotice').value = data.notice || data.system_notice || '';
            }
        }).catch(function () {
            document.getElementById('settingError').textContent = '加载失败，请确认 vote-backend 已启动';
            document.getElementById('settingError').style.display = 'block';
        });
    }

    document.getElementById('settingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var notice = document.getElementById('settingNotice').value || '';
        if (!window.adminRequest) { alert('请求未就绪'); return; }
        var body = { notice: notice };
        window.adminRequest.put('/api/admin/setting', body).then(function (res) {
            if (res && res.code === 200) alert('保存成功');
            else alert(res && res.message ? res.message : '保存失败');
        }).catch(function () { alert('请求失败'); });
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadSettings);
    else loadSettings();
})();
