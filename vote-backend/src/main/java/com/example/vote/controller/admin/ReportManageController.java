package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.entity.Report;
import com.example.vote.repository.ReportRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * 管理端 - 举报/投诉管理
 */
@Tag(name = "管理端-举报管理")
@RestController
@RequestMapping("/api/admin/report")
@RequiredArgsConstructor
public class ReportManageController {
    private final ReportRepository reportRepository;

    @GetMapping("/list")
    @Operation(summary = "举报/投诉列表")
    public Result<Page<Report>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (status != null) {
            return Result.ok(reportRepository.findByStatusOrderByCreateTimeDesc(status, PageRequest.of(page, size)));
        }
        return Result.ok(reportRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createTime"))));
    }

    @GetMapping("/detail/{reportId}")
    @Operation(summary = "举报/投诉详情")
    public Result<Report> detail(@PathVariable Long reportId) {
        return reportRepository.findById(reportId)
            .map(Result::ok)
            .orElseGet(() -> Result.fail(ResultCode.NOT_FOUND.getCode(), "记录不存在"));
    }

    @PutMapping("/handle/{reportId}")
    @Operation(summary = "处理举报/投诉")
    public Result<Report> handle(@PathVariable Long reportId, @RequestParam Integer status, @RequestParam(required = false) String handleRemark) {
        Report r = reportRepository.findById(reportId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "记录不存在"));
        r.setStatus(status);
        if (handleRemark != null) r.setHandleRemark(handleRemark);
        r.setHandleTime(LocalDateTime.now());
        return Result.ok(reportRepository.save(r));
    }
}
