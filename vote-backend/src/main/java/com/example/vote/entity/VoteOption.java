package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 投票选项（候选人/选项）
 */
@Data
@Entity
@Table(name = "vote_option")
public class VoteOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "vote_id", nullable = false)
    private Long voteId;
    @Column(name = "option_title", nullable = false, length = 256)
    private String optionTitle;
    @Column(name = "option_description", columnDefinition = "text")
    private String optionDescription;
    @Column(name = "option_image", length = 512)
    private String optionImage;
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
    @Column(name = "vote_count", nullable = false)
    private Integer voteCount = 0;
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
