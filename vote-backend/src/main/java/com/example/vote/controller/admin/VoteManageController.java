package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.dto.vote.VoteResultVO;
import com.example.vote.entity.Vote;
import com.example.vote.repository.VoteOptionRepository;
import com.example.vote.repository.VoteRepository;
import com.example.vote.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * 管理端 - 投票管理
 */
@Tag(name = "管理端-投票管理")
@RestController
@RequestMapping("/api/admin/vote")
@RequiredArgsConstructor
public class VoteManageController {
    private final VoteRepository voteRepository;
    private final VoteOptionRepository voteOptionRepository;
    private final VoteService voteService;

    @GetMapping("/list")
    @Operation(summary = "投票列表/搜索")
    public Result<Page<Vote>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (status != null && categoryId != null) {
            return Result.ok(voteRepository.findByCategoryIdAndStatusOrderByCreateTimeDesc(categoryId, status, PageRequest.of(page, size)));
        }
        if (status != null) {
            return Result.ok(voteRepository.findByStatusOrderByCreateTimeDesc(status, PageRequest.of(page, size)));
        }
        return Result.ok(voteRepository.findAll(PageRequest.of(page, size)));
    }

    @GetMapping("/detail/{voteId}")
    @Operation(summary = "投票详情")
    public Result<VoteResultVO> detail(@PathVariable Long voteId) {
        return voteService.getResult(voteId)
            .map(Result::ok)
            .orElseGet(() -> Result.fail(ResultCode.NOT_FOUND.getCode(), "投票不存在"));
    }

    @PostMapping("/create")
    @Operation(summary = "新增投票（后台）")
    public Result<Vote> create(@RequestBody com.example.vote.dto.vote.CreateVoteRequest request) {
        Vote v = voteService.create(1L, request);
        v.setCreatorType(2);
        voteRepository.save(v);
        return Result.ok(v);
    }

    @PutMapping("/edit/{voteId}")
    @Operation(summary = "编辑投票")
    public Result<Vote> edit(@PathVariable Long voteId, @RequestBody com.example.vote.dto.vote.CreateVoteRequest request) {
        Vote vote = voteRepository.findById(voteId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "投票不存在"));
        vote.setTitle(request.getTitle());
        vote.setDescription(request.getDescription());
        vote.setCoverImage(request.getCoverImage());
        vote.setCategoryId(request.getCategoryId());
        vote.setVoteType(request.getVoteType() != null ? request.getVoteType() : 1);
        return Result.ok(voteRepository.save(vote));
    }

    @DeleteMapping("/delete/{voteId}")
    @Operation(summary = "删除投票")
    public Result<Void> delete(@PathVariable Long voteId) {
        if (!voteRepository.existsById(voteId)) {
            return Result.fail(ResultCode.NOT_FOUND.getCode(), "投票不存在");
        }
        voteRepository.deleteById(voteId);
        return Result.ok();
    }

    @PutMapping("/status/{voteId}")
    @Operation(summary = "修改投票状态")
    public Result<Vote> status(@PathVariable Long voteId, @RequestParam(defaultValue = "1") Integer status) {
        Vote vote = voteRepository.findById(voteId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "投票不存在"));
        vote.setStatus(status);
        return Result.ok(voteRepository.save(vote));
    }
}










