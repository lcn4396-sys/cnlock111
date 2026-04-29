package com.example.vote.service.impl;

import com.example.vote.dto.report.CreateReportRequest;
import com.example.vote.entity.Report;
import com.example.vote.repository.ReportRepository;
import com.example.vote.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;

    @Override
    public Report create(Long reporterId, CreateReportRequest request) {
        Report r = new Report();
        r.setReportType(request.getReportType());
        r.setTargetType(request.getTargetType().trim());
        r.setTargetId(request.getTargetId());
        r.setReporterId(reporterId);
        r.setContent(request.getContent().trim());
        r.setStatus(0);
        reportRepository.save(r);
        return r;
    }
}
