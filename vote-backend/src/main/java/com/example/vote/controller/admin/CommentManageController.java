package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.entity.Comment;
import com.example.vote.repository.CommentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

/**
 * 管理端 - 评论管理
 */
@Tag(name = "管理端-评论管理")
@RestController
@RequestMapping("/api/admin/comment")
@RequiredArgsConstructor
public class CommentManageController {
    private final CommentRepository commentRepository;

    @GetMapping("/list")
    @Operation(summary = "评论列表")
    public Result<Page<Comment>> list(
            @RequestParam(required = false) Long voteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (voteId != null) {
            return Result.ok(commentRepository.findByVoteIdAndStatusOrderByCreateTimeDesc(voteId, 0, PageRequest.of(page, size)));
        }
        return Result.ok(commentRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createTime"))));
    }

    @GetMapping("/detail/{commentId}")
    @Operation(summary = "评论详情")
    public Result<Comment> detail(@PathVariable Long commentId) {
        return commentRepository.findById(commentId)
            .map(Result::ok)
            .orElseGet(() -> Result.fail(ResultCode.NOT_FOUND.getCode(), "评论不存在"));
    }

    @PutMapping("/review/{commentId}")
    @Operation(summary = "审核评论")
    public Result<Comment> review(@PathVariable Long commentId, @RequestParam Integer status) {
        Comment c = commentRepository.findById(commentId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "评论不存在"));
        c.setStatus(status);
        return Result.ok(commentRepository.save(c));
    }

    @DeleteMapping("/delete/{commentId}")
    @Operation(summary = "删除评论")
    public Result<Void> delete(@PathVariable Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            return Result.fail(ResultCode.NOT_FOUND.getCode(), "评论不存在");
        }
        commentRepository.deleteById(commentId);
        return Result.ok();
    }
}
