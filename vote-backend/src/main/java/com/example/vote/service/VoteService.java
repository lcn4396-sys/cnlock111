package com.example.vote.service;

import com.example.vote.dto.vote.CreateVoteRequest;
import com.example.vote.dto.vote.SubmitVoteRequest;
import com.example.vote.dto.vote.VoteResultVO;
import com.example.vote.entity.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface VoteService {
    Page<Vote> listPublished(Long categoryId, Pageable pageable);
    Optional<Vote> getById(Long id);
    Vote create(Long creatorUserId, CreateVoteRequest request);
    void submit(Long userId, String clientIp, SubmitVoteRequest request);
    Optional<VoteResultVO> getResult(Long voteId);
    Page<Vote> myCreated(Long userId, Pageable pageable);
    Page<Vote> myJoined(Long userId, Pageable pageable);
    VoteResultVO getShareInfo(Long voteId);
}
