package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理后台用户
 */
@Data
@Entity
@Table(name = "admin_user")
public class AdminUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 64)
    private String username;
    @Column(nullable = false, length = 128)
    private String password;
    @Column(length = 64)
    private String nickname;
    @Column(length = 20)
    private String mobile;
    @Column(length = 128)
    private String email;
    @Column(length = 512)
    private String avatar;
    @Column(name = "role_id")
    private Long roleId;
    @Column(nullable = false)
    private Integer status = 1;
    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;
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
