package com.example.vote.service.impl;

import com.example.vote.common.exception.BusinessException;
import com.example.vote.service.WechatApiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

/**
 * 微信小程序服务端 API 实现：获取 access_token、通过 code 换取手机号
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WechatApiServiceImpl implements WechatApiService {

    private static final String URL_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";
    private static final String URL_GET_PHONE = "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=%s";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${wechat.mini.app-id:}")
    private String appId;
    @Value("${wechat.mini.app-secret:}")
    private String appSecret;

    private String cachedAccessToken;
    private long tokenExpireTime;

    @Override
    public String getPhoneNumberByCode(String code) {
        if (!StringUtils.hasText(code)) {
            throw new BusinessException(400, "手机号授权 code 不能为空");
        }
        // 开发环境：未配置 appId 时支持 dev_phone_13800138000 格式便于联调
        if (!StringUtils.hasText(appId) || !StringUtils.hasText(appSecret)) {
            if (code.startsWith("dev_phone_") && code.length() > "dev_phone_".length()) {
                String devPhone = code.substring("dev_phone_".length()).trim();
                if (devPhone.matches("\\d{11}")) {
                    log.warn("使用开发模式手机号: {}", devPhone);
                    return devPhone;
                }
            }
            throw new BusinessException(500, "未配置微信小程序 AppID/Secret，无法使用手机号登录");
        }
        String accessToken = getAccessToken();
        String url = String.format(URL_GET_PHONE, accessToken);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body;
        try {
            body = objectMapper.writeValueAsString(java.util.Collections.singletonMap("code", code));
        } catch (Exception e) {
            throw new BusinessException(400, "请求参数异常");
        }
        HttpEntity<String> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            int errcode = root.path("errcode").asInt(0);
            if (errcode != 0) {
                String errmsg = root.path("errmsg").asText("unknown");
                log.warn("微信获取手机号失败 errcode={} errmsg={}", errcode, errmsg);
                throw new BusinessException(400, "获取手机号失败：" + errmsg);
            }
            JsonNode phoneInfo = root.path("phone_info");
            if (phoneInfo.isMissingNode()) {
                throw new BusinessException(400, "微信未返回手机号信息");
            }
            String purePhone = phoneInfo.path("purePhoneNumber").asText(null);
            if (!StringUtils.hasText(purePhone)) {
                purePhone = phoneInfo.path("phoneNumber").asText(null);
            }
            if (!StringUtils.hasText(purePhone)) {
                throw new BusinessException(400, "无法解析手机号");
            }
            return purePhone;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("调用微信获取手机号异常", e);
            throw new BusinessException(500, "获取手机号服务异常");
        }
    }

    private synchronized String getAccessToken() {
        if (cachedAccessToken != null && System.currentTimeMillis() < tokenExpireTime) {
            return cachedAccessToken;
        }
        String url = String.format(URL_TOKEN, appId, appSecret);
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.has("errcode") && root.get("errcode").asInt() != 0) {
                throw new BusinessException(500, "获取微信 access_token 失败");
            }
            cachedAccessToken = root.path("access_token").asText();
            int expiresIn = root.path("expires_in").asInt(7200);
            tokenExpireTime = System.currentTimeMillis() + (expiresIn - 300) * 1000L;
            return cachedAccessToken;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("获取微信 access_token 异常", e);
            throw new BusinessException(500, "微信服务异常");
        }
    }
}
