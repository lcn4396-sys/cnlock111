/**
 * 管理后台 - 公共脚本
 */
(function () {
    'use strict';
    // 当前页面高亮侧栏
    var path = window.location.pathname;
    document.querySelectorAll('.sidebar .nav-link').forEach(function (el) {
        var href = el.getAttribute('href');
        if (href && path.indexOf(href) === 0) {
            el.classList.add('active');
        }
    });
})();
