package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.entity.AdminUser;
import com.example.vote.repository.AdminUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 管理端 - 管理员个人信息（占位：未接 Session 时返回默认）
 */
@Tag(name = "管理端-管理员")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ProfileController {
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    @Operation(summary = "管理员个人信息")
    public Result<AdminUser> profile() {
        return adminUserRepository.findByUsername("admin")
            .map(u -> {
                u.setPassword(null);
                return Result.<AdminUser>ok(u);
            })
            .orElse(Result.fail(404, "未登录"));
    }

    @PutMapping("/profile/edit")
    @Operation(summary = "修改管理员信息")
    public Result<AdminUser> edit(@RequestBody AdminUser user) {
        AdminUser u = adminUserRepository.findByUsername("admin").orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "未登录"));
        if (user.getNickname() != null) u.setNickname(user.getNickname());
        if (user.getMobile() != null) u.setMobile(user.getMobile());
        if (user.getEmail() != null) u.setEmail(user.getEmail());
        if (user.getAvatar() != null) u.setAvatar(user.getAvatar());
        u.setPassword(null);
        return Result.ok(adminUserRepository.save(u));
    }

    @PutMapping("/profile/password")
    @Operation(summary = "修改管理员密码")
    public Result<Void> password(@RequestParam String oldPassword, @RequestParam String newPassword) {
        AdminUser u = adminUserRepository.findByUsername("admin").orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "未登录"));
        if (!passwordEncoder.matches(oldPassword, u.getPassword())) {
            return Result.fail(400, "原密码错误");
        }
        u.setPassword(passwordEncoder.encode(newPassword));
        adminUserRepository.save(u);
        return Result.ok();
    }
}
