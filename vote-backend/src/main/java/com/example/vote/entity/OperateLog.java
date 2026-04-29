package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 操作日志
 */
@Data
@Entity
@Table(name = "operate_log")
public class OperateLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "admin_id")
    private Long adminId;
    @Column(name = "username", length = 64)
    private String username;
    @Column(length = 64)
    private String module;
    @Column(length = 128)
    private String action;
    @Column(name = "request_method", length = 16)
    private String requestMethod;
    @Column(name = "request_url", length = 512)
    private String requestUrl;
    @Column(name = "request_param", columnDefinition = "text")
    private String requestParam;
    @Column(length = 64)
    private String ip;
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;

    @PrePersist
    public void prePersist() {
        if (createTime == null) createTime = LocalDateTime.now();
    }
}
