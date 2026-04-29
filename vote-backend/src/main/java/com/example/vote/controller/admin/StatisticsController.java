package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理端 - 数据统计
 */
@Tag(name = "管理端-统计")
@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;

    @GetMapping("/overview")
    @Operation(summary = "概览统计")
    public Result<Map<String, Object>> overview() {
        Map<String, Object> map = new HashMap<>();
        map.put("voteCount", voteRepository.count());
        map.put("userCount", userRepository.count());
        map.put("commentCount", commentRepository.count());
        map.put("reportCount", reportRepository.count());
        return Result.ok(map);
    }

    @GetMapping("/export")
    @Operation(summary = "数据导出（占位）")
    public Result<Map<String, Object>> export(@RequestParam(required = false) String type) {
        Map<String, Object> map = new HashMap<>();
        map.put("message", "请按需实现导出逻辑");
        return Result.ok(map);
    }
}
