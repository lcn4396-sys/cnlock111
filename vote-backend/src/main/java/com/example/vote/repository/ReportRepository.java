package com.example.vote.repository;

import com.example.vote.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByStatusOrderByCreateTimeDesc(Integer status, Pageable pageable);
    Page<Report> findByReporterIdOrderByCreateTimeDesc(Long reporterId, Pageable pageable);
}
