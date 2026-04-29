package com.example.vote.controller;

import com.example.vote.common.result.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 根路径与健康检查，避免浏览器访问 localhost 报「invalid response」
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public Result<Map<String, Object>> home() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "在线投票评选系统 API");
        info.put("docs", "/swagger-ui.html");
        info.put("mini", "/api/mini");
        info.put("admin", "/api/admin");
        return Result.ok(info);
    }

    @GetMapping("/health")
    public Result<String> health() {
        return Result.ok("ok");
    }
}
