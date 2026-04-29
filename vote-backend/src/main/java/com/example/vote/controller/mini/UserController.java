package com.example.vote.controller.mini;

import com.example.vote.common.constant.SecurityConstant;
import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.dto.user.PasswordRequest;
import com.example.vote.dto.user.ProfileEditRequest;
import com.example.vote.entity.User;
import com.example.vote.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 小程序 - 用户/我的
 */
@Tag(name = "小程序-用户")
@RestController
@RequestMapping("/api/mini/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(summary = "当前用户信息")
    @GetMapping("/profile")
    public Result<User> profile() {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(userService.getProfile(userId));
    }

    @Operation(summary = "修改我的信息")
    @PutMapping("/profile/edit")
    public Result<User> profileEdit(@RequestBody @Valid ProfileEditRequest request) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        return Result.ok(userService.editProfile(userId, request));
    }

    @Operation(summary = "修改密码")
    @PutMapping("/password")
    public Result<Void> password(@RequestBody @Valid PasswordRequest request) {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId == null) return Result.fail(ResultCode.UNAUTHORIZED.getCode(), "请先登录");
        userService.changePassword(userId, request);
        return Result.ok();
    }

    @Operation(summary = "退出登录")
    @PostMapping("/logout")
    public Result<Void> logout() {
        Long userId = SecurityConstant.getCurrentUserId();
        if (userId != null) userService.logout(userId);
        return Result.ok();
    }
}
