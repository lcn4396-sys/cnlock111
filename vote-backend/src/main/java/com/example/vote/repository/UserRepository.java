package com.example.vote.repository;

import com.example.vote.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByOpenId(String openId);
    boolean existsByOpenId(String openId);
    Optional<User> findByMobile(String mobile);
}
