package com.example.vote.common.exception;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

/**
 * 全局异常处理，统一返回 Result
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusiness(BusinessException e) {
        return Result.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<?> handleValidation(Exception e) {
        String msg = e instanceof MethodArgumentNotValidException
            ? ((MethodArgumentNotValidException) e).getBindingResult().getFieldError().getDefaultMessage()
            : ((BindException) e).getBindingResult().getFieldError().getDefaultMessage();
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), msg != null ? msg : "参数校验失败");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Result<?> handleAccessDenied() {
        return Result.fail(ResultCode.FORBIDDEN);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<?> handleMaxUploadSizeExceeded() {
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), "上传图片不能超过10MB");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<?> handleOther(Exception e, HttpServletRequest request) {
        log.error("request {} error", request.getRequestURI(), e);
        return Result.fail(ResultCode.ERROR.getCode(), "服务异常，请稍后重试");
    }
}
