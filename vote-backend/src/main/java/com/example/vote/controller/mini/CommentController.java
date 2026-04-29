package com.example.vote.controller.mini;

import com.example.vote.common.constant.SecurityConstant;
import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.dto.comment.CreateCommentRequest;
import com.example.vote.entity.Comment;
import com.example.vote.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 小程序 - 评论
 */
@Tag(name = "小程序-评论")
@RestController
@RequestMapping("/api/mini/comment")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @Operation(summary = "评论列表")
    @GetMapping("/list")
    public Result<Page<Comment>> list(
            @RequestParam Long voteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.ok(commentService.listByVoteId(voteId, PageRequest.of(page, size)));
    }

    @Operation(summary = "发表评论")
    @PostMapping("/create")
    public Result<Comment> create(@RequestBody @Valid CreateCommentRequest request) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(commentService.create(userId, request));
    }

    @Operation(summary = "删除评论")
    @DeleteMapping("/delete/{commentId}")
    public Result<Void> delete(@PathVariable Long commentId) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        commentService.delete(commentId, userId);
        return Result.ok();
    }

    @Operation(summary = "评论点赞/取消点赞")
    @PostMapping("/like/{commentId}")
    public Result<Void> like(@PathVariable Long commentId) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        commentService.toggleLike(commentId, userId);
        return Result.ok();
    }
}
