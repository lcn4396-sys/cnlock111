package com.example.vote.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 投票记录
 */
@Data
@Entity
@Table(name = "vote_record")
public class VoteRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "vote_id", nullable = false)
    private Long voteId;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "option_id", nullable = false)
    private Long optionId;
    @Column(length = 64)
    private String ip;
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;

    @PrePersist
    public void prePersist() {
        if (createTime == null) createTime = LocalDateTime.now();
    }
}
