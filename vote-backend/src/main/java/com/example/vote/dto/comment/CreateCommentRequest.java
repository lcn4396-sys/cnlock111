package com.example.vote.dto.comment;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 发表评论
 */
@Data
public class CreateCommentRequest {
    @NotNull
    private Long voteId;
    @NotBlank
    @Size(max = 2000)
    private String content;
}
