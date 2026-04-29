/**
 * 投票编辑（管理端）- 对接 /api/admin/category/list、vote/detail、vote/create、vote/edit
 */
(function () {
    'use strict';

    function getQueryParam(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function loadCategories() {
        if (!window.adminRequest) return;
        window.adminRequest.get('/api/admin/category/list').then(function (res) {
            if (res && res.code === 200 && res.data) {
                var list = Array.isArray(res.data) ? res.data : [];
                var sel = document.getElementById('voteCategoryId');
                sel.innerHTML = '<option value="">请选择</option>' + list.map(function (c) {
                    return '<option value="' + c.id + '">' + (c.name || '') + '</option>';
                }).join('');
            }
        }).catch(function () {});
    }

    function loadVote(id) {
        if (!id || !window.adminRequest) return;
        window.adminRequest.get('/api/admin/vote/detail/' + id).then(function (res) {
            if (res && res.code === 200 && res.data) {
                var data = res.data;
                var vote = data.vote || {};
                var options = data.options || [];
                document.getElementById('voteId').value = vote.id;
                document.getElementById('voteTitle').value = vote.title || '';
                document.getElementById('voteDesc').value = vote.description || '';
                document.getElementById('voteCover').value = vote.coverImage || '';
                document.getElementById('voteCategoryId').value = vote.categoryId || '';
                document.getElementById('voteOptionTitles').value = options.map(function (o) { return o.optionTitle || ''; }).filter(Boolean).join('\n');
                document.getElementById('voteEditTitle').textContent = '编辑投票';
                document.getElementById('voteOptionsWrap').style.display = 'none';
            }
        }).catch(function () {
            document.getElementById('voteEditError').textContent = '加载投票失败';
            document.getElementById('voteEditError').style.display = 'block';
        });
    }

    document.getElementById('voteForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var id = document.getElementById('voteId').value.trim();
        var title = document.getElementById('voteTitle').value.trim();
        var desc = document.getElementById('voteDesc').value.trim();
        var cover = document.getElementById('voteCover').value.trim();
        var categoryId = document.getElementById('voteCategoryId').value;
        if (!title) { alert('请填写标题'); return; }
        if (!window.adminRequest) { alert('请求未就绪'); return; }
        var body = {
            title: title,
            description: desc || null,
            coverImage: cover || null,
            categoryId: categoryId ? parseInt(categoryId, 10) : null,
            voteType: 1
        };
        if (!id) {
            var optionTitlesText = document.getElementById('voteOptionTitles').value.trim();
            var optionTitles = optionTitlesText.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
            if (optionTitles.length < 2) { alert('新建投票请至少填写2个选项（每行一个）'); return; }
            body.optionTitles = optionTitles;
            window.adminRequest.post('/api/admin/vote/create', body).then(function (res) {
                if (res && res.code === 200) { alert('创建成功'); window.location.href = '/vote/list'; }
                else alert(res && res.message ? res.message : '创建失败');
            }).catch(function () { alert('请求失败'); });
        } else {
            window.adminRequest.put('/api/admin/vote/edit/' + id, body).then(function (res) {
                if (res && res.code === 200) { alert('保存成功'); window.location.href = '/vote/list'; }
                else alert(res && res.message ? res.message : '保存失败');
            }).catch(function () { alert('请求失败'); });
        }
    });

    loadCategories();
    var id = getQueryParam('id');
    if (id) {
        document.getElementById('voteEditTitle').textContent = '编辑投票';
        loadVote(id);
    } else {
        document.getElementById('voteEditTitle').textContent = '新建投票';
    }
})();
