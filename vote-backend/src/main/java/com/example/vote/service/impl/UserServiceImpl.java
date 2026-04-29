package com.example.vote.service.impl;

import com.example.vote.common.exception.BusinessException;
import com.example.vote.dto.user.PasswordRequest;
import com.example.vote.dto.user.ProfileEditRequest;
import com.example.vote.entity.User;
import com.example.vote.repository.UserRepository;
import com.example.vote.security.JwtUtil;
import com.example.vote.service.UserService;
import com.example.vote.service.WechatApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final WechatApiService wechatApiService;

    @Override
    @Transactional
    public String loginByCode(String code) {
        String openId = "openid_" + (code != null ? code.hashCode() : System.currentTimeMillis());
        User user = userRepository.findByOpenId(openId).orElseGet(() -> {
            User u = new User();
            u.setOpenId(openId);
            u.setStatus(1);
            userRepository.save(u);
            return u;
        });
        if (user.getStatus() != 1) {
            throw new BusinessException(403, "账号已禁用");
        }
        return jwtUtil.generateToken(user.getId(), user.getOpenId());
    }

    @Override
    @Transactional
    public String loginByPhoneCode(String code) {
        String mobile = wechatApiService.getPhoneNumberByCode(code);
        if (!StringUtils.hasText(mobile)) {
            throw new BusinessException(400, "无法获取手机号");
        }
        String openId = "phone_" + mobile;
        User user = userRepository.findByMobile(mobile)
            .or(() -> userRepository.findByOpenId(openId))
            .orElseGet(() -> {
                User u = new User();
                u.setOpenId(openId);
                u.setMobile(mobile);
                u.setStatus(1);
                userRepository.save(u);
                return u;
            });
        if (!mobile.equals(user.getMobile())) {
            user.setMobile(mobile);
            userRepository.save(user);
        }
        if (user.getStatus() != 1) {
            throw new BusinessException(403, "账号已禁用");
        }
        return jwtUtil.generateToken(user.getId(), user.getOpenId());
    }

    @Override
    public User getProfile(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(401, "登录已失效，请重新登录"));
    }

    @Override
    @Transactional
    public User editProfile(Long userId, ProfileEditRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(401, "登录已失效，请重新登录"));
        if (StringUtils.hasText(request.getNickname())) user.setNickname(request.getNickname());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (StringUtils.hasText(request.getBirthday())) {
            try { user.setBirthday(LocalDate.parse(request.getBirthday())); } catch (DateTimeParseException ignored) {}
        }
        if (request.getMobile() != null) user.setMobile(request.getMobile());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, PasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(401, "登录已失效，请重新登录"));
        if (user.getPasswordHash() != null && !passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BusinessException(400, "原密码错误");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void logout(Long userId) {
        // 无状态 JWT：客户端丢弃 token 即可
    }
}
