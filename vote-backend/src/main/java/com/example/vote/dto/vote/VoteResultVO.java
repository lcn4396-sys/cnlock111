package com.example.vote.dto.vote;

import com.example.vote.entity.Vote;
import com.example.vote.entity.VoteOption;
import lombok.Data;

import java.util.List;

/**
 * 投票结果（含选项得票）
 */
@Data
public class VoteResultVO {
    private Vote vote;
    private List<VoteOption> options;
}
