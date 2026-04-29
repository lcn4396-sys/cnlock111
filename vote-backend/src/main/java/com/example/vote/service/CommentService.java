package com.example.vote.service;

import com.example.vote.dto.comment.CreateCommentRequest;
import com.example.vote.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    Page<Comment> listByVoteId(Long voteId, Pageable pageable);
    Comment create(Long userId, CreateCommentRequest request);
    void delete(Long commentId, Long userId);
    void toggleLike(Long commentId, Long userId);
}
