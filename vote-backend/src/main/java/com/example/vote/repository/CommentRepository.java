package com.example.vote.repository;

import com.example.vote.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByVoteIdAndStatusOrderByCreateTimeDesc(Long voteId, Integer status, Pageable pageable);
    /** 投票详情页：按时间倒序展示该投票下所有评论（含未审核） */
    Page<Comment> findByVoteIdOrderByCreateTimeDesc(Long voteId, Pageable pageable);
    Page<Comment> findByUserIdOrderByCreateTimeDesc(Long userId, Pageable pageable);
}
