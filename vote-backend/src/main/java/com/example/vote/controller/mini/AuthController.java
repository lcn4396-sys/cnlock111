package com.example.vote.controller.mini;

import com.example.vote.common.result.Result;
import com.example.vote.dto.user.WechatLoginRequest;
import com.example.vote.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 小程序 - 微信登录（code 换 token）、手机号登录
 */
@Tag(name = "小程序-登录")
@RestController
@RequestMapping("/api/mini/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @Operation(summary = "微信登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody @Valid WechatLoginRequest request) {
        String token = userService.loginByCode(request.getCode());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        return Result.ok(data);
    }

    @Operation(summary = "手机号登录")
    @PostMapping("/login/phone")
    public Result<Map<String, Object>> loginByPhone(@RequestBody @Valid WechatLoginRequest request) {
        String token = userService.loginByPhoneCode(request.getCode());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        return Result.ok(data);
    }
}
