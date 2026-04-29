/**
 * 管理后台 - 请求封装（与 /api/admin 对接）
 * 使用 form 登录时 CSRF token 由页面注入；若改为 API 登录可在此携带 token
 */
(function (window) {
    'use strict';
    // 管理后台请求 vote-backend 接口，默认 http://localhost:8081
    var baseUrl = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : 'http://localhost:8081';
    function getCsrfToken() {
        var meta = document.querySelector('meta[name="_csrf"]');
        return meta ? meta.getAttribute('content') : '';
    }
    window.adminRequest = {
        get: function (url, options) {
            options = options || {};
            return fetch(baseUrl + url, {
                method: 'GET',
                headers: Object.assign({ 'Accept': 'application/json' }, options.headers || {})
            }).then(function (r) { return r.json(); });
        },
        post: function (url, data, options) {
            options = options || {};
            var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
            var token = getCsrfToken();
            if (token) headers['X-CSRF-TOKEN'] = token;
            return fetch(baseUrl + url, {
                method: 'POST',
                headers: Object.assign(headers, options.headers || {}),
                body: data ? JSON.stringify(data) : undefined
            }).then(function (r) { return r.json(); });
        },
        put: function (url, data, options) {
            options = options || {};
            var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
            var token = getCsrfToken();
            if (token) headers['X-CSRF-TOKEN'] = token;
            return fetch(baseUrl + url, {
                method: 'PUT',
                headers: Object.assign(headers, options.headers || {}),
                body: data ? JSON.stringify(data) : undefined
            }).then(function (r) { return r.json(); });
        },
        delete: function (url, options) {
            options = options || {};
            var headers = { 'Accept': 'application/json' };
            var token = getCsrfToken();
            if (token) headers['X-CSRF-TOKEN'] = token;
            return fetch(baseUrl + url, { method: 'DELETE', headers: Object.assign(headers, options.headers || {}) })
                .then(function (r) { return r.json(); });
        }
    };
})(window);
