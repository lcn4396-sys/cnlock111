package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 小程序用户（微信端）
 */
@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "open_id", nullable = false, unique = true, length = 128)
    private String openId;
    @Column(name = "union_id", length = 128)
    private String unionId;
    @Column(length = 64)
    private String nickname;
    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;
    @Column(length = 20)
    private String mobile;
    @Column(length = 128)
    private String email;
    private Integer gender;
    private LocalDate birthday;
    @Column(length = 256)
    private String address;
    @Column(name = "password_hash", length = 128)
    private String passwordHash;
    @Column(nullable = false)
    private Integer status = 1;
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;

    @PrePersist
    public void prePersist() {
        if (createTime == null) createTime = LocalDateTime.now();
        if (updateTime == null) updateTime = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updateTime = LocalDateTime.now();
    }
}
