package com.example.vote.service;

/**
 * 微信小程序服务端 API（获取 access_token、手机号等）
 */
public interface WechatApiService {
    /**
     * 通过 getPhoneNumber 返回的 code 换取用户手机号
     * @param code 小程序端 button open-type="getPhoneNumber" 回调中的 code
     * @return 手机号（如 13800138000），失败抛 BusinessException
     */
    String getPhoneNumberByCode(String code);
}
