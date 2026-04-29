package com.example.vote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 在线投票评选系统 - 后端服务启动类
 * 提供 /api/mini（小程序API）、/api/admin（管理端API）
 */
@SpringBootApplication
public class VoteApplication {

    public static void main(String[] args) {
        SpringApplication.run(VoteApplication.class, args);
    }
}
