package com.example.vote.dto.report;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 举报/投诉
 */
@Data
public class CreateReportRequest {
    @NotNull
    private Integer reportType; // 1-举报 2-投诉
    @NotBlank
    @Size(max = 32)
    private String targetType; // vote, comment, user
    @NotNull
    private Long targetId;
    @NotBlank
    @Size(max = 2000)
    private String content;
}
