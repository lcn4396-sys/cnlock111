package com.example.vote.dto.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 微信 code 登录
 */
@Data
public class WechatLoginRequest {
    @NotBlank
    private String code;
}
