/**
 * 投票结果页 - 对接 GET /api/admin/vote/detail/{voteId}，ECharts 柱状图 + 饼图
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = (typeof location !== 'undefined' && location.search || '').match(new RegExp('[?&]' + name + '=([^&]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function showError(msg) {
        var tip = document.getElementById('voteResultLoadTip');
        var err = document.getElementById('voteResultError');
        if (tip) tip.style.display = 'none';
        if (err) {
            err.textContent = msg || '加载失败';
            err.style.display = 'block';
        }
    }

    function renderCharts(options) {
        if (!options || options.length === 0) {
            showError('暂无选项数据');
            return;
        }
        var names = options.map(function (o) { return o.optionTitle || ('选项' + o.id); });
        var values = options.map(function (o) { return o.voteCount != null ? o.voteCount : 0; });
        var total = values.reduce(function (a, b) { return a + b; }, 0);
        var pieData = names.map(function (n, i) { return { name: n, value: values[i] }; });

        var barEl = document.getElementById('chartResultBar');
        var pieEl = document.getElementById('chartResultPie');
        var tip = document.getElementById('voteResultLoadTip');
        if (tip) tip.style.display = 'none';
        if (barEl) barEl.style.display = 'block';
        if (pieEl) pieEl.style.display = 'block';

        if (typeof echarts === 'undefined') {
            showError('ECharts 未加载');
            return;
        }

        var barChart = echarts.init(barEl);
        barChart.setOption({
            title: { text: '各选项得票数', left: 'center' },
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', top: 40, containLabel: true },
            xAxis: { type: 'category', data: names, axisLabel: { rotate: names.length > 6 ? 30 : 0 } },
            yAxis: { type: 'value', name: '得票数' },
            series: [{ name: '得票', type: 'bar', data: values, itemStyle: { color: '#5470c6' } }]
        });

        var pieChart = echarts.init(pieEl);
        pieChart.setOption({
            title: { text: '得票占比', left: 'center' },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
                    return params.name + ': ' + params.value + ' 票 (' + pct + '%)';
                }
            },
            legend: { orient: 'vertical', left: 'left', type: 'scroll' },
            series: [{
                name: '得票',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '55%'],
                data: pieData,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } }
            }]
        });

        window.addEventListener('resize', function () {
            barChart.resize();
            pieChart.resize();
        });
    }

    function loadResult() {
        var id = getQueryParam('id');
        var tip = document.getElementById('voteResultLoadTip');
        var err = document.getElementById('voteResultError');
        var summary = document.getElementById('voteResultSummary');
        if (err) err.style.display = 'none';

        if (!id) {
            if (tip) tip.textContent = '请从投票列表点击「详情」或「结果」进入，或访问 /vote/result?id=投票ID';
            return;
        }

        if (!window.adminRequest) {
            showError('请先加载 request.js');
            return;
        }

        window.adminRequest.get('/api/admin/vote/detail/' + id).then(function (res) {
            if (!res || res.code !== 200 || !res.data) {
                showError((res && res.message) ? res.message : '加载失败');
                return;
            }
            var vo = res.data;
            var vote = vo.vote || {};
            var options = vo.options || [];
            if (tip) tip.style.display = 'none';

            var titleEl = document.getElementById('voteResultTitle');
            var participantEl = document.getElementById('voteResultParticipant');
            if (summary) summary.style.display = 'block';
            if (titleEl) titleEl.textContent = vote.title || '投票结果';
            if (participantEl) participantEl.textContent = vote.participantCount != null ? vote.participantCount : 0;

            renderCharts(options);
        }).catch(function () {
            showError('请求失败，请确认 vote-backend 已启动（http://localhost:8081）');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadResult);
    } else {
        loadResult();
    }
})();
