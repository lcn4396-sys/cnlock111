package com.example.vote.dto.vote;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 创建投票请求（小程序）
 */
@Data
public class CreateVoteRequest {
    @NotBlank(message = "标题不能为空")
    @Size(max = 128)
    private String title;
    @Size(max = 2000)
    private String description;
    private String coverImage;
    private Long categoryId;
    private Integer voteType = 1;
    /** 每人最多可选几项，1=单选，>1=多选 */
    private Integer limitPerUser = 1;
    private String startTime;
    private String endTime;
    private List<@NotBlank @Size(max = 256) String> optionTitles;
}
