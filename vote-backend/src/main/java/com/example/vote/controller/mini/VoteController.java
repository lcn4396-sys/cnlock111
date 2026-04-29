package com.example.vote.controller.mini;

import com.example.vote.common.constant.SecurityConstant;
import com.example.vote.common.exception.BusinessException;
import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.dto.vote.CreateVoteRequest;
import com.example.vote.dto.vote.SubmitVoteRequest;
import com.example.vote.dto.vote.VoteResultVO;
import com.example.vote.entity.Vote;
import com.example.vote.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * 小程序 - 投票 API
 */
@Slf4j
@Tag(name = "小程序-投票")
@RestController
@RequestMapping("/api/mini/vote")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    private Path getUploadDir() {
        return Paths.get(System.getProperty("user.dir"), "uploads", "vote").toAbsolutePath().normalize();
    }

    @Operation(summary = "投票列表")
    @GetMapping("/list")
    public Result<Page<Vote>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            return Result.ok(voteService.listPublished(categoryId, PageRequest.of(page, size)));
        } catch (Exception e) {
            log.warn("投票列表查询失败", e);
            return Result.ok(Page.empty(PageRequest.of(page, size > 0 ? size : 10)));
        }
    }

    @Operation(summary = "投票详情")
    @GetMapping("/detail/{id}")
    public Result<Vote> detail(@PathVariable Long id) {
        Optional<Vote> opt = voteService.getById(id);
        return opt.map(Result::ok).orElseGet(() -> Result.fail(ResultCode.NOT_FOUND.getCode(), "投票不存在"));
    }

    @Operation(summary = "创建投票")
    @PostMapping("/create")
    public Result<Vote> create(@RequestBody @Valid CreateVoteRequest request) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        try {
            return Result.ok(voteService.create(userId, request));
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.warn("创建投票失败", e);
            return Result.fail(500, "创建失败，请确保数据库已执行 hall_schema.sql 并稍后重试");
        }
    }

    @Operation(summary = "上传投票封面")
    @PostMapping("/upload_cover")
    public Result<String> uploadCover(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        if (file == null || file.isEmpty()) return Result.fail(400, "请上传图片");
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return Result.fail(400, "仅支持图片文件");
        }
        try {
            String original = file.getOriginalFilename();
            String ext = ".jpg";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }
            Path uploadDir = getUploadDir();
            Files.createDirectories(uploadDir);
            String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().replace("-", "") + ext;
            Path target = uploadDir.resolve(fileName);
            file.transferTo(Objects.requireNonNull(target));
            String base = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            return Result.ok(base + "/api/mini/vote/cover/" + fileName);
        } catch (IOException e) {
            log.warn("上传投票封面失败", e);
            return Result.fail(500, "上传失败，请稍后重试");
        }
    }

    @Operation(summary = "查看投票封面")
    @GetMapping("/cover/{fileName:.+}")
    public ResponseEntity<Resource> cover(@PathVariable String fileName) {
        try {
            if (fileName.contains("..")) return ResponseEntity.notFound().build();
            Path uploadDir = getUploadDir();
            Path target = uploadDir.resolve(fileName).normalize();
            if (!target.startsWith(uploadDir) || !Files.exists(target)) return ResponseEntity.notFound().build();
            Resource resource = new UrlResource(Objects.requireNonNull(target.toUri()));
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            String contentType = Files.probeContentType(target);
            if (contentType != null && !contentType.isEmpty()) {
                mediaType = MediaType.parseMediaType(contentType);
            }
            return ResponseEntity.ok().contentType(Objects.requireNonNull(mediaType)).body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            log.warn("读取投票封面失败", e);
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "参与投票/提交选择")
    @PostMapping("/submit")
    public Result<Void> submit(@RequestBody @Valid SubmitVoteRequest request, HttpServletRequest req) {
        Long userId = SecurityConstant.getCurrentUserId();
        String ip = req.getRemoteAddr();
        voteService.submit(userId, ip, request);
        return Result.ok();
    }

    @Operation(summary = "投票结果")
    @GetMapping("/result/{id}")
    public Result<VoteResultVO> result(@PathVariable Long id) {
        Optional<VoteResultVO> opt = voteService.getResult(id);
        return opt.map(Result::ok).orElseGet(() -> Result.fail(ResultCode.NOT_FOUND.getCode(), "投票不存在"));
    }

    @Operation(summary = "排行榜")
    @GetMapping("/rank/{id}")
    public Result<VoteResultVO> rank(@PathVariable Long id) {
        return result(id);
    }

    @Operation(summary = "分享投票")
    @GetMapping("/share/{id}")
    public Result<VoteResultVO> share(@PathVariable Long id) {
        return Result.ok(voteService.getShareInfo(id));
    }

    @Operation(summary = "我创建的投票")
    @GetMapping("/my_created")
    public Result<Page<Vote>> myCreated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(voteService.myCreated(userId, PageRequest.of(page, size)));
    }

    @Operation(summary = "我参与的投票")
    @GetMapping("/my_joined")
    public Result<Page<Vote>> myJoined(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(voteService.myJoined(userId, PageRequest.of(page, size)));
    }
}
