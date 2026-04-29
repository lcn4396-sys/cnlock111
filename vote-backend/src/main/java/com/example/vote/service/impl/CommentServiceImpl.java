package com.example.vote.service.impl;

import com.example.vote.common.exception.BusinessException;
import com.example.vote.dto.comment.CreateCommentRequest;
import com.example.vote.entity.Comment;
import com.example.vote.entity.CommentLike;
import com.example.vote.repository.CommentLikeRepository;
import com.example.vote.repository.CommentRepository;
import com.example.vote.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Override
    public Page<Comment> listByVoteId(Long voteId, Pageable pageable) {
        return commentRepository.findByVoteIdOrderByCreateTimeDesc(voteId, pageable);
    }

    @Override
    @Transactional
    public Comment create(Long userId, CreateCommentRequest request) {
        Comment c = new Comment();
        c.setVoteId(request.getVoteId());
        c.setUserId(userId);
        c.setContent(request.getContent().trim());
        c.setLikeCount(0);
        c.setStatus(0);
        return commentRepository.save(c);
    }

    @Override
    @Transactional
    public void delete(Long commentId, Long userId) {
        Comment c = commentRepository.findById(commentId).orElseThrow(() -> new BusinessException(404, "评论不存在"));
        if (!c.getUserId().equals(userId)) {
            throw new BusinessException(403, "只能删除自己的评论");
        }
        commentRepository.delete(c);
    }

    @Override
    @Transactional
    public void toggleLike(Long commentId, Long userId) {
        Comment c = commentRepository.findById(commentId).orElseThrow(() -> new BusinessException(404, "评论不存在"));
        if (commentLikeRepository.existsByCommentIdAndUserId(commentId, userId)) {
            commentLikeRepository.deleteByCommentIdAndUserId(commentId, userId);
            c.setLikeCount(Math.max(0, c.getLikeCount() - 1));
        } else {
            CommentLike like = new CommentLike();
            like.setCommentId(commentId);
            like.setUserId(userId);
            commentLikeRepository.save(like);
            c.setLikeCount(c.getLikeCount() + 1);
        }
        commentRepository.save(c);
    }
}
