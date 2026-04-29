package com.example.vote.repository;

import com.example.vote.entity.OperateLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperateLogRepository extends JpaRepository<OperateLog, Long> {
    Page<OperateLog> findByAdminIdOrderByCreateTimeDesc(Long adminId, Pageable pageable);
    Page<OperateLog> findAllByOrderByCreateTimeDesc(Pageable pageable);
}
