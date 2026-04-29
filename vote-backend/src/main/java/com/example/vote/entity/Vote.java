package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 投票主表
 */
@Data
@Entity
@Table(name = "vote")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 128)
    private String title;
    @Column(columnDefinition = "text")
    private String description;
    @Column(name = "cover_image", length = 512)
    private String coverImage;
    @Column(name = "category_id")
    private Long categoryId;
    @Column(name = "creator_id", nullable = false)
    private Long creatorId;
    @Column(name = "creator_type", nullable = false)
    private Integer creatorType = 1;
    @Column(nullable = false)
    private Integer status = 0;
    @Column(name = "vote_type", nullable = false)
    private Integer voteType = 1;
    @Column(name = "start_time")
    private LocalDateTime startTime;
    @Column(name = "end_time")
    private LocalDateTime endTime;
    @Column(name = "limit_per_user", nullable = false)
    private Integer limitPerUser = 1;
    @Column(name = "limit_per_user_per_day")
    private Integer limitPerUserPerDay;
    @Column(name = "allow_guest", nullable = false)
    private Integer allowGuest = 0;
    @Column(name = "participant_count", nullable = false)
    private Integer participantCount = 0;
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
