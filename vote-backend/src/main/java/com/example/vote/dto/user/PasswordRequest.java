package com.example.vote.dto.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 修改密码
 */
@Data
public class PasswordRequest {
    @NotBlank
    @Size(min = 6, max = 32)
    private String oldPassword;
    @NotBlank
    @Size(min = 6, max = 32)
    private String newPassword;
}
