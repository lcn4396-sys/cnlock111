package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 评论
 */
@Data
@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "vote_id", nullable = false)
    private Long voteId;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(nullable = false, columnDefinition = "text")
    private String content;
    @Column(name = "like_count", nullable = false)
    private Integer likeCount = 0;
    @Column(nullable = false)
    private Integer status = 0;
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
