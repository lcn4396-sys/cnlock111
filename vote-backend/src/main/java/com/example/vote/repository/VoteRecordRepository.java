package com.example.vote.repository;

import com.example.vote.entity.VoteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {
    List<VoteRecord> findByVoteIdAndUserId(Long voteId, Long userId);
    List<VoteRecord> findByUserId(Long userId);
    boolean existsByVoteIdAndUserIdAndOptionId(Long voteId, Long userId, Long optionId);
    long countByVoteId(Long voteId);
    long countByOptionId(Long optionId);
    long countByVoteIdAndUserId(Long voteId, Long userId);
    Optional<VoteRecord> findFirstByVoteIdAndUserIdAndOptionId(Long voteId, Long userId, Long optionId);
}
