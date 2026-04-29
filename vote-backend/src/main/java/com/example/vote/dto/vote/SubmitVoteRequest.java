package com.example.vote.dto.vote;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 参与投票/提交选择
 */
@Data
public class SubmitVoteRequest {
    @NotNull
    private Long voteId;
    @NotNull
    private Long optionId;
}
