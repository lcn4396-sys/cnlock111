package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 举报/投诉
 */
@Data
@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "report_type", nullable = false)
    private Integer reportType;
    @Column(name = "target_type", nullable = false, length = 32)
    private String targetType;
    @Column(name = "target_id", nullable = false)
    private Long targetId;
    @Column(name = "reporter_id", nullable = false)
    private Long reporterId;
    @Column(nullable = false, columnDefinition = "text")
    private String content;
    @Column(nullable = false)
    private Integer status = 0;
    @Column(name = "handle_remark", length = 512)
    private String handleRemark;
    @Column(name = "handle_time")
    private LocalDateTime handleTime;
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
