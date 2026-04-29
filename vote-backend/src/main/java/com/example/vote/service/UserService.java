package com.example.vote.service;

import com.example.vote.dto.user.PasswordRequest;
import com.example.vote.dto.user.ProfileEditRequest;
import com.example.vote.entity.User;

/**
 * 小程序用户
 */
public interface UserService {
    String loginByCode(String code);
    /** 手机号登录：用 getPhoneNumber 返回的 code 换手机号，按手机号查找或创建用户并返回 token */
    String loginByPhoneCode(String code);
    User getProfile(Long userId);
    User editProfile(Long userId, ProfileEditRequest request);
    void changePassword(Long userId, PasswordRequest request);
    void logout(Long userId);
}
