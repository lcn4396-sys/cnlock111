package com.example.vote.service;

import com.example.vote.dto.report.CreateReportRequest;
import com.example.vote.entity.Report;

public interface ReportService {
    Report create(Long reporterId, CreateReportRequest request);
}
