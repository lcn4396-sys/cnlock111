package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.entity.SystemSetting;
import com.example.vote.repository.SystemSettingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理端 - 系统设置
 */
@Tag(name = "管理端-系统设置")
@RestController
@RequestMapping("/api/admin/setting")
@RequiredArgsConstructor
public class SettingController {
    private final SystemSettingRepository systemSettingRepository;

    @GetMapping("")
    @Operation(summary = "获取系统设置")
    public Result<Map<String, String>> get() {
        Map<String, String> map = new HashMap<>();
        systemSettingRepository.findAll().forEach(s -> map.put(s.getSettingKey(), s.getSettingValue()));
        return Result.ok(map);
    }

    @PutMapping("")
    @Operation(summary = "保存系统设置")
    public Result<Void> put(@RequestBody Map<String, String> settings) {
        for (Map.Entry<String, String> e : settings.entrySet()) {
            SystemSetting s = systemSettingRepository.findBySettingKey(e.getKey()).orElse(new SystemSetting());
            s.setSettingKey(e.getKey());
            s.setSettingValue(e.getValue());
            systemSettingRepository.save(s);
        }
        return Result.ok();
    }
}
