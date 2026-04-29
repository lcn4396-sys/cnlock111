/**
 * 举报详情 - 对接 /api/admin/report/detail、handle
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function formatTime(str) {
        if (!str) return '-';
        try {
            var d = new Date(str);
            return isNaN(d.getTime()) ? str : d.toLocaleString('zh-CN');
        } catch (e) { return str; }
    }

    var reportId = getQueryParam('id');
    if (!reportId) {
        document.getElementById('reportDetailError').textContent = '缺少举报ID';
        document.getElementById('reportDetailError').style.display = 'block';
    } else {
        if (!window.adminRequest) {
            document.getElementById('reportDetailError').textContent = '请先加载 request.js';
            document.getElementById('reportDetailError').style.display = 'block';
        } else {
            window.adminRequest.get('/api/admin/report/detail/' + reportId).then(function (res) {
                if (res && res.code === 200 && res.data) {
                    var r = res.data;
                    document.getElementById('reportId').textContent = r.id;
                    document.getElementById('reportType').textContent = r.reportType === 1 ? '举报' : (r.reportType === 2 ? '投诉' : ('类型' + r.reportType));
                    document.getElementById('reportTarget').textContent = (r.targetType || '') + ' #' + (r.targetId || '');
                    document.getElementById('reportReporterId').textContent = r.reporterId;
                    document.getElementById('reportContent').textContent = r.content || '-';
                    document.getElementById('reportStatus').textContent = r.status === 1 ? '已处理' : '待处理';
                    document.getElementById('reportHandleRemark').textContent = r.handleRemark || '-';
                    document.getElementById('reportCreateTime').textContent = formatTime(r.createTime);
                    document.getElementById('reportDetailBox').style.display = 'block';
                    if (r.status === 1) document.getElementById('reportHandleArea').style.display = 'none';
                } else {
                    document.getElementById('reportDetailError').textContent = (res && res.message) ? res.message : '记录不存在';
                    document.getElementById('reportDetailError').style.display = 'block';
                }
            }).catch(function () {
                document.getElementById('reportDetailError').textContent = '请求失败';
                document.getElementById('reportDetailError').style.display = 'block';
            });
        }
    }

    document.getElementById('btnReportHandle') && document.getElementById('btnReportHandle').addEventListener('click', function () {
        var remark = (document.getElementById('reportHandleRemarkInput') && document.getElementById('reportHandleRemarkInput').value) || '';
        if (!reportId || !window.adminRequest) return;
        var url = '/api/admin/report/handle/' + reportId + '?status=1';
        if (remark) url += '&handleRemark=' + encodeURIComponent(remark);
        window.adminRequest.put(url).then(function (res) {
            if (res && res.code === 200) { alert('已标记为已处理'); window.location.reload(); }
            else alert(res && res.message ? res.message : '操作失败');
        }).catch(function () { alert('请求失败'); });
    });
})();
