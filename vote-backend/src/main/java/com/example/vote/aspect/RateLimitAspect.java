package com.example.vote.aspect;

import com.example.vote.common.exception.BusinessException;
import com.example.vote.common.result.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 简单限流：按 IP/用户维度限制接口调用频率（内存实现，可改为 Redis）
 */
@Slf4j
@Aspect
@Component
public class RateLimitAspect {

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private final Map<String, CountHolder> cache = new ConcurrentHashMap<>();

    @Around("execution(* com.example.vote.controller.mini.VoteController.submit(..)) || " +
            "execution(* com.example.vote.controller.mini.CommentController.create(..)) || " +
            "execution(* com.example.vote.controller.mini.ReportController.create(..))")
    public Object rateLimit(ProceedingJoinPoint pjp) throws Throwable {
        HttpServletRequest request = null;
        for (Object arg : pjp.getArgs()) {
            if (arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
                break;
            }
        }
        String key = request != null ? request.getRemoteAddr() : "unknown";
        CountHolder h = cache.computeIfAbsent(key, k -> new CountHolder());
        synchronized (h) {
            long now = System.currentTimeMillis();
            if (now - h.windowStart > 60_000) {
                h.windowStart = now;
                h.count = 0;
            }
            h.count++;
            if (h.count > MAX_REQUESTS_PER_MINUTE) {
                throw new BusinessException(ResultCode.ERROR.getCode(), "操作过于频繁，请稍后再试");
            }
        }
        return pjp.proceed();
    }

    private static class CountHolder {
        long windowStart = System.currentTimeMillis();
        int count = 0;
    }
}
