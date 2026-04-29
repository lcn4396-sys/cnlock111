/**
 * 数据统计 - 对接 /api/admin/statistics/overview，填充卡片与可选 ECharts
 */
(function () {
    'use strict';

    function loadOverview() {
        if (!window.adminRequest) {
            document.getElementById('statisticsError').textContent = '请先加载 request.js';
            document.getElementById('statisticsError').style.display = 'block';
            return;
        }
        document.getElementById('statisticsError').style.display = 'none';
        window.adminRequest.get('/api/admin/statistics/overview').then(function (res) {
            if (res && res.code === 200 && res.data) {
                var d = res.data;
                document.getElementById('statUserCount').textContent = d.userCount != null ? d.userCount : 0;
                document.getElementById('statVoteCount').textContent = d.voteCount != null ? d.voteCount : 0;
                document.getElementById('statCommentCount').textContent = d.commentCount != null ? d.commentCount : 0;
                document.getElementById('statReportCount').textContent = d.reportCount != null ? d.reportCount : 0;
                var userCount = d.userCount != null ? d.userCount : 0;
                var voteCount = d.voteCount != null ? d.voteCount : 0;
                var commentCount = d.commentCount != null ? d.commentCount : 0;
                var reportCount = d.reportCount != null ? d.reportCount : 0;
                if (typeof echarts !== 'undefined' && document.getElementById('chartStatistics')) {
                    var chart = echarts.init(document.getElementById('chartStatistics'));
                    chart.setOption({
                        title: { text: '数据概览' },
                        tooltip: {},
                        xAxis: { type: 'category', data: ['用户', '投票', '评论', '举报'] },
                        yAxis: { type: 'value' },
                        series: [{ name: '数量', type: 'bar', data: [userCount, voteCount, commentCount, reportCount] }]
                    });
                }
            } else {
                document.getElementById('statisticsError').textContent = (res && res.message) ? res.message : '加载失败';
                document.getElementById('statisticsError').style.display = 'block';
            }
        }).catch(function () {
            document.getElementById('statisticsError').textContent = '请求失败，请确认 vote-backend 已启动';
            document.getElementById('statisticsError').style.display = 'block';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadOverview);
    } else {
        loadOverview();
    }
})();
