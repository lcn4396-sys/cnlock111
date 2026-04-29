package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.entity.OperateLog;
import com.example.vote.repository.OperateLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

/**
 * 管理端 - 操作日志
 */
@Tag(name = "管理端-操作日志")
@RestController
@RequestMapping("/api/admin/log")
@RequiredArgsConstructor
public class LogController {
    private final OperateLogRepository operateLogRepository;

    @GetMapping("/list")
    @Operation(summary = "操作日志列表")
    public Result<Page<OperateLog>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.ok(operateLogRepository.findAllByOrderByCreateTimeDesc(PageRequest.of(page, size)));
    }
}
