package com.example.vote.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 后台管理页面路由：返回 Thymeleaf 视图名，与 templates 目录对应
 */
@Controller
public class PageController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // ---------- 投票管理 ----------
    @GetMapping({ "/", "/vote/list" })
    public String voteList() {
        return "vote/list";
    }

    @GetMapping("/vote/edit")
    public String voteEdit() {
        return "vote/edit";
    }

    @GetMapping("/vote/detail")
    public String voteDetail() {
        return "vote/detail";
    }

    @GetMapping("/vote/result")
    public String voteResult() {
        return "vote/result";
    }

    // ---------- 分类管理 ----------
    @GetMapping("/category/list")
    public String categoryList() {
        return "category/list";
    }

    @GetMapping("/category/edit")
    public String categoryEdit() {
        return "category/edit";
    }

    // ---------- 用户管理 ----------
    @GetMapping("/user/list")
    public String userList() {
        return "user/list";
    }

    @GetMapping("/user/detail")
    public String userDetail() {
        return "user/detail";
    }

    // ---------- 评论管理 ----------
    @GetMapping("/comment/list")
    public String commentList() {
        return "comment/list";
    }

    @GetMapping("/comment/detail")
    public String commentDetail() {
        return "comment/detail";
    }

    // ---------- 举报投诉管理 ----------
    @GetMapping("/report/list")
    public String reportList() {
        return "report/list";
    }

    @GetMapping("/report/detail")
    public String reportDetail() {
        return "report/detail";
    }

    // ---------- 系统设置 ----------
    @GetMapping("/system/profile")
    public String systemProfile() {
        return "system/profile";
    }

    @GetMapping("/system/role")
    public String systemRole() {
        return "system/role";
    }

    @GetMapping("/system/setting")
    public String systemSetting() {
        return "system/setting";
    }

    // ---------- 日志与统计 ----------
    @GetMapping("/log/operate")
    public String logOperate() {
        return "log/operate";
    }

    @GetMapping("/log/statistics")
    public String logStatistics() {
        return "log/statistics";
    }
}
