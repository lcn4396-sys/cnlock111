package com.example.vote.common.constant;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 安全相关常量与工具
 */
public final class SecurityConstant {
    private SecurityConstant() {}

    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) return null;
        Object p = auth.getPrincipal();
        if (p instanceof Long) return (Long) p;
        return null;
    }
}
