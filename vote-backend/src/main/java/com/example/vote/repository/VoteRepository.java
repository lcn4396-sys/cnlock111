package com.example.vote.repository;

import com.example.vote.entity.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Page<Vote> findByStatusOrderByCreateTimeDesc(Integer status, Pageable pageable);
    Page<Vote> findByCategoryIdAndStatusOrderByCreateTimeDesc(Long categoryId, Integer status, Pageable pageable);
    Page<Vote> findByCreatorIdOrderByCreateTimeDesc(Long creatorId, Pageable pageable);
    Page<Vote> findByIdInOrderByCreateTimeDesc(List<Long> ids, Pageable pageable);
}
