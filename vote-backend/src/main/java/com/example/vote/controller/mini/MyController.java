package com.example.vote.controller.mini;

import com.example.vote.common.constant.SecurityConstant;
import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.repository.CommentRepository;
import com.example.vote.repository.ReportRepository;
import com.example.vote.repository.VoteRecordRepository;
import com.example.vote.repository.VoteRepository;
import com.example.vote.entity.Comment;
import com.example.vote.entity.Report;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 小程序 - 我的（操作记录汇总）
 */
@Tag(name = "小程序-我的")
@RestController
@RequestMapping("/api/mini/my")
@RequiredArgsConstructor
public class MyController {
    private final VoteRepository voteRepository;
    private final VoteRecordRepository voteRecordRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;

    @Operation(summary = "我评论过/举报过/投诉过/分享过的投票等汇总")
    @GetMapping("/actions")
    public Result<Map<String, Object>> actions() {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        Map<String, Object> data = new HashMap<>();
        data.put("createdCount", voteRepository.findByCreatorIdOrderByCreateTimeDesc(userId, PageRequest.of(0, 1)).getTotalElements());
        data.put("joinedCount", voteRecordRepository.findByUserId(userId).stream().map(r -> r.getVoteId()).distinct().count());
        data.put("commentCount", commentRepository.findByUserIdOrderByCreateTimeDesc(userId, PageRequest.of(0, 1)).getTotalElements());
        data.put("reportCount", reportRepository.findByReporterIdOrderByCreateTimeDesc(userId, PageRequest.of(0, 1)).getTotalElements());
        return Result.ok(data);
    }

    @Operation(summary = "我的评论列表")
    @GetMapping("/comments")
    public Result<Page<Comment>> myComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(commentRepository.findByUserIdOrderByCreateTimeDesc(userId, PageRequest.of(page, size)));
    }

    @Operation(summary = "我的举报列表")
    @GetMapping("/reports")
    public Result<Page<Report>> myReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(reportRepository.findByReporterIdOrderByCreateTimeDesc(userId, PageRequest.of(page, size)));
    }
}
