package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.entity.User;
import com.example.vote.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 管理端 - 用户管理
 */
@Tag(name = "管理端-用户管理")
@RestController
@RequestMapping("/api/admin/user")
@RequiredArgsConstructor
public class UserManageController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/list")
    @Operation(summary = "用户列表")
    public Result<Page<User>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.ok(userRepository.findAll(PageRequest.of(page, size)));
    }

    @GetMapping("/detail/{userId}")
    @Operation(summary = "用户详情")
    public Result<User> detail(@PathVariable Long userId) {
        return userRepository.findById(userId)
            .map(Result::ok)
            .orElseGet(() -> Result.fail(ResultCode.NOT_FOUND.getCode(), "用户不存在"));
    }

    @PutMapping("/status/{userId}")
    @Operation(summary = "启用/禁用用户")
    public Result<User> status(@PathVariable Long userId, @RequestParam Integer status) {
        User u = userRepository.findById(userId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "用户不存在"));
        u.setStatus(status);
        return Result.ok(userRepository.save(u));
    }

    @PutMapping("/reset_password/{userId}")
    @Operation(summary = "重置密码")
    public Result<Void> resetPassword(@PathVariable Long userId, @RequestParam String newPassword) {
        User u = userRepository.findById(userId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "用户不存在"));
        u.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(u);
        return Result.ok();
    }

    @PutMapping("/edit/{userId}")
    @Operation(summary = "编辑用户")
    public Result<User> edit(@PathVariable Long userId, @RequestBody User user) {
        User u = userRepository.findById(userId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "用户不存在"));
        if (user.getNickname() != null) u.setNickname(user.getNickname());
        if (user.getMobile() != null) u.setMobile(user.getMobile());
        if (user.getEmail() != null) u.setEmail(user.getEmail());
        if (user.getStatus() != null) u.setStatus(user.getStatus());
        return Result.ok(userRepository.save(u));
    }
}
