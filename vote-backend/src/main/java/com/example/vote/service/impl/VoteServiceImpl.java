package com.example.vote.service.impl;

import com.example.vote.common.exception.BusinessException;
import com.example.vote.common.result.ResultCode;
import com.example.vote.dto.vote.CreateVoteRequest;
import com.example.vote.dto.vote.SubmitVoteRequest;
import com.example.vote.dto.vote.VoteResultVO;
import com.example.vote.entity.Vote;
import com.example.vote.entity.VoteOption;
import com.example.vote.entity.VoteRecord;
import com.example.vote.repository.VoteOptionRepository;
import com.example.vote.repository.VoteRecordRepository;
import com.example.vote.repository.VoteRepository;
import com.example.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {
    private final VoteRepository voteRepository;
    private final VoteOptionRepository voteOptionRepository;
    private final VoteRecordRepository voteRecordRepository;

    @Override
    public Page<Vote> listPublished(Long categoryId, Pageable pageable) {
        if (categoryId != null) {
            return voteRepository.findByCategoryIdAndStatusOrderByCreateTimeDesc(categoryId, 1, pageable);
        }
        return voteRepository.findByStatusOrderByCreateTimeDesc(1, pageable);
    }

    @Override
    public Optional<Vote> getById(Long id) {
        return voteRepository.findById(id);
    }

    @Override
    @Transactional
    public Vote create(Long creatorUserId, CreateVoteRequest request) {
        if (request.getOptionTitles() == null || request.getOptionTitles().size() < 2) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "至少需要2个选项");
        }
        Vote vote = new Vote();
        vote.setTitle(request.getTitle().trim());
        vote.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        vote.setCoverImage(request.getCoverImage());
        vote.setCategoryId(request.getCategoryId());
        vote.setCreatorId(creatorUserId);
        vote.setCreatorType(1);
        vote.setStatus(1);
        vote.setVoteType(request.getVoteType() != null ? request.getVoteType() : 1);
        int limit = request.getLimitPerUser() != null && request.getLimitPerUser() >= 1 ? request.getLimitPerUser() : 1;
        vote.setLimitPerUser(limit);
        vote.setParticipantCount(0);
        if (request.getStartTime() != null && !request.getStartTime().trim().isEmpty()) {
            try {
                vote.setStartTime(LocalDateTime.parse(request.getStartTime().trim(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            } catch (DateTimeParseException ignored) {}
        }
        if (request.getEndTime() != null && !request.getEndTime().trim().isEmpty()) {
            try {
                vote.setEndTime(LocalDateTime.parse(request.getEndTime().trim(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            } catch (DateTimeParseException ignored) {}
        }
        vote = voteRepository.save(vote);
        int order = 0;
        for (String title : request.getOptionTitles()) {
            if (title == null || title.trim().isEmpty()) continue;
            VoteOption opt = new VoteOption();
            opt.setVoteId(vote.getId());
            opt.setOptionTitle(title.trim());
            opt.setSortOrder(order++);
            opt.setVoteCount(0);
            voteOptionRepository.save(opt);
        }
        return vote;
    }

    @Override
    @Transactional
    public void submit(Long userId, String clientIp, SubmitVoteRequest request) {
        Vote vote = voteRepository.findById(request.getVoteId())
            .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND.getCode(), "投票不存在"));
        if (vote.getStatus() != 1) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "投票已结束或未发布");
        }
        VoteOption option = voteOptionRepository.findById(request.getOptionId())
            .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND.getCode(), "选项不存在"));
        if (!option.getVoteId().equals(vote.getId())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "选项不属于该投票");
        }
        Long uid = userId != null ? userId : null;
        if (uid != null && voteRecordRepository.existsByVoteIdAndUserIdAndOptionId(vote.getId(), uid, option.getId())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "您已投过该选项");
        }
        long voted = uid != null ? voteRecordRepository.countByVoteIdAndUserId(vote.getId(), uid) : 0;
        if (voted >= vote.getLimitPerUser()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "已达该投票次数上限");
        }
        VoteRecord record = new VoteRecord();
        record.setVoteId(vote.getId());
        record.setUserId(uid);
        record.setOptionId(option.getId());
        record.setIp(clientIp);
        voteRecordRepository.save(record);
        option.setVoteCount(option.getVoteCount() + 1);
        voteOptionRepository.save(option);
        vote.setParticipantCount((int) voteRecordRepository.countByVoteId(vote.getId()));
        voteRepository.save(vote);
    }

    @Override
    public Optional<VoteResultVO> getResult(Long voteId) {
        return voteRepository.findById(voteId).map(v -> {
            VoteResultVO vo = new VoteResultVO();
            vo.setVote(v);
            vo.setOptions(voteOptionRepository.findByVoteIdOrderBySortOrderAsc(voteId));
            return vo;
        });
    }

    @Override
    public Page<Vote> myCreated(Long userId, Pageable pageable) {
        return voteRepository.findByCreatorIdOrderByCreateTimeDesc(userId, pageable);
    }

    @Override
    public Page<Vote> myJoined(Long userId, Pageable pageable) {
        List<Long> voteIds = voteRecordRepository.findByUserId(userId).stream()
            .map(VoteRecord::getVoteId).distinct().collect(Collectors.toList());
        if (voteIds.isEmpty()) return new PageImpl<>(Collections.emptyList(), pageable, 0);
        return voteRepository.findByIdInOrderByCreateTimeDesc(voteIds, pageable);
    }

    @Override
    public VoteResultVO getShareInfo(Long voteId) {
        return getResult(voteId).orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND.getCode(), "投票不存在"));
    }
}
