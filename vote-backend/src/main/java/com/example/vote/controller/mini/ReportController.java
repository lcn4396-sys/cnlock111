package com.example.vote.controller.mini;

import com.example.vote.common.constant.SecurityConstant;
import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.dto.report.CreateReportRequest;
import com.example.vote.entity.Report;
import com.example.vote.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 小程序 - 举报/投诉
 */
@Tag(name = "小程序-举报")
@RestController
@RequestMapping("/api/mini/report")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @Operation(summary = "提交举报/投诉")
    @PostMapping("/create")
    public Result<Report> create(@RequestBody @Valid CreateReportRequest request) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(reportService.create(userId, request));
    }
}
