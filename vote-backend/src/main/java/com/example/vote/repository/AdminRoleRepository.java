package com.example.vote.repository;

import com.example.vote.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminRoleRepository extends JpaRepository<AdminRole, Long> {
    List<AdminRole> findByStatusOrderByIdAsc(Integer status);
}
