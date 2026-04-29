package com.example.vote.aspect;

import com.example.vote.entity.OperateLog;
import com.example.vote.repository.OperateLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 管理端关键操作记录到 operate_log（可扩展从 Session 取 adminId）
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class OperateLogAspect {

    private final OperateLogRepository operateLogRepository;

    @Around("execution(* com.example.vote.controller.admin..*.*(..))")
    public Object logOperate(ProceedingJoinPoint pjp) throws Throwable {
        Object result = pjp.proceed();
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = attrs != null ? attrs.getRequest() : null;
            if (request == null) return result;
            String method = request.getMethod();
            String uri = request.getRequestURI();
            if (!"GET".equals(method) || uri.contains("/delete") || uri.contains("/edit") || uri.contains("/create") || uri.contains("/handle") || uri.contains("/review") || uri.contains("/status")) {
                OperateLog logEntity = new OperateLog();
                logEntity.setRequestMethod(method);
                logEntity.setRequestUrl(uri);
                logEntity.setModule(uri.split("/")[3]);
                logEntity.setAction(pjp.getSignature().getName());
                logEntity.setIp(request.getRemoteAddr());
                operateLogRepository.save(logEntity);
            }
        } catch (Exception e) {
            log.warn("OperateLog save failed", e);
        }
        return result;
    }
}
