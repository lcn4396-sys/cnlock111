package com.example.vote.dto.user;

import lombok.Data;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * 修改我的信息
 */
@Data
public class ProfileEditRequest {
    @Size(max = 64)
    private String nickname;
    @Size(max = 512)
    private String avatarUrl;
    private Integer gender;
    private String birthday;
    /** 手机号：不填为空，填则必须为 11 位数字（中国大陆） */
    @Size(max = 20)
    @Pattern(regexp = "^$|^\\d{11}$", message = "手机号须为11位数字")
    private String mobile;
    @Size(max = 128)
    private String email;
    @Size(max = 256)
    private String address;
}
