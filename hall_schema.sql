-- Active: 1772542265716@@127.0.0.1@3306@hall
-- Active: 1772542265716@@127.0.0.1@3306@hall
-- ================================================================================
-- 在线投票评选系统 - 数据库建表脚本
-- 数据库名：hall
-- 说明：字段均带中文注释；管理后台用户表含初始账号 admin / admin（密码为 BCrypt 加密）
-- ================================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建并选用数据库
CREATE DATABASE IF NOT EXISTS `hall` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hall`;

-- --------------------------------------------------------------------------------
-- 1. 投票分类表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(64) NOT NULL COMMENT '分类名称',
  `description` varchar(512) DEFAULT NULL COMMENT '分类描述',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序号，越小越靠前',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投票分类表';

-- --------------------------------------------------------------------------------
-- 2. 小程序用户表（微信端用户）
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `open_id` varchar(128) NOT NULL COMMENT '微信 OpenID',
  `union_id` varchar(128) DEFAULT NULL COMMENT '微信 UnionID（可选）',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `avatar_url` varchar(512) DEFAULT NULL COMMENT '头像 URL',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `gender` tinyint DEFAULT NULL COMMENT '性别：0-未知 1-男 2-女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `address` varchar(256) DEFAULT NULL COMMENT '地址',
  `password_hash` varchar(128) DEFAULT NULL COMMENT '密码哈希（若支持账号密码登录）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_open_id` (`open_id`),
  KEY `idx_mobile` (`mobile`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小程序用户表';

-- --------------------------------------------------------------------------------
-- 3. 投票主表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `vote`;
CREATE TABLE `vote` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(128) NOT NULL COMMENT '投票标题',
  `description` text COMMENT '投票描述',
  `cover_image` varchar(512) DEFAULT NULL COMMENT '封面图片 URL',
  `category_id` bigint DEFAULT NULL COMMENT '分类 ID',
  `creator_id` bigint NOT NULL COMMENT '创建人用户 ID（小程序用户）',
  `creator_type` tinyint NOT NULL DEFAULT 1 COMMENT '创建人类型：1-小程序用户 2-管理员',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-草稿 1-已发布 2-已下架 3-已结束',
  `vote_type` tinyint NOT NULL DEFAULT 1 COMMENT '投票类型：1-单选 2-多选',
  `start_time` datetime DEFAULT NULL COMMENT '投票开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '投票结束时间',
  `limit_per_user` int NOT NULL DEFAULT 1 COMMENT '每人可投票数（总计）',
  `limit_per_user_per_day` int DEFAULT NULL COMMENT '每人每日可投票数（NULL 表示不限制）',
  `allow_guest` tinyint NOT NULL DEFAULT 0 COMMENT '是否允许未登录参与：0-否 1-是',
  `participant_count` int NOT NULL DEFAULT 0 COMMENT '参与人数（冗余统计）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_start_end_time` (`start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投票主表';

-- --------------------------------------------------------------------------------
-- 4. 投票选项表（候选人/选项）
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `vote_option`;
CREATE TABLE `vote_option` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `vote_id` bigint NOT NULL COMMENT '所属投票 ID',
  `option_title` varchar(256) NOT NULL COMMENT '选项标题/名称',
  `option_description` text COMMENT '选项描述',
  `option_image` varchar(512) DEFAULT NULL COMMENT '选项图片 URL',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序号',
  `vote_count` int NOT NULL DEFAULT 0 COMMENT '当前得票数（冗余，便于排行与结果展示）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_vote_id` (`vote_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投票选项表';

-- --------------------------------------------------------------------------------
-- 5. 投票记录表（用户参与投票的记录）
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `vote_record`;
CREATE TABLE `vote_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `vote_id` bigint NOT NULL COMMENT '投票 ID',
  `user_id` bigint DEFAULT NULL COMMENT '用户 ID（未登录可为 NULL，若 allow_guest=1）',
  `option_id` bigint NOT NULL COMMENT '所投选项 ID',
  `ip` varchar(64) DEFAULT NULL COMMENT 'IP（用于限流或风控）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投票时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vote_user_option` (`vote_id`, `user_id`, `option_id`),
  KEY `idx_vote_id` (`vote_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_option_id` (`option_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投票记录表';

-- 说明：若业务允许多选且同一用户对同一投票投多个选项，唯一键改为 uk_vote_user（同一用户同一投票一条记录，选项存关联表或 JSON）。此处按“每用户每选项至多一票”设计。

-- --------------------------------------------------------------------------------
-- 6. 评论表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `vote_id` bigint NOT NULL COMMENT '所属投票 ID',
  `user_id` bigint NOT NULL COMMENT '评论用户 ID',
  `content` text NOT NULL COMMENT '评论内容',
  `like_count` int NOT NULL DEFAULT 0 COMMENT '点赞数',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-待审核 1-通过 2-驳回/隐藏',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_vote_id` (`vote_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- --------------------------------------------------------------------------------
-- 7. 评论点赞记录表（可选，用于防重复点赞与统计）
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `comment_like`;
CREATE TABLE `comment_like` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `comment_id` bigint NOT NULL COMMENT '评论 ID',
  `user_id` bigint NOT NULL COMMENT '用户 ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_comment_user` (`comment_id`, `user_id`),
  KEY `idx_comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论点赞记录表';

-- --------------------------------------------------------------------------------
-- 8. 举报/投诉表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `report_type` tinyint NOT NULL COMMENT '类型：1-举报 2-投诉',
  `target_type` varchar(32) NOT NULL COMMENT '关联对象类型：vote-投票 comment-评论 user-用户',
  `target_id` bigint NOT NULL COMMENT '关联对象 ID',
  `reporter_id` bigint NOT NULL COMMENT '发起人用户 ID',
  `content` text NOT NULL COMMENT '举报/投诉内容',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '处理状态：0-待处理 1-已处理 2-已驳回',
  `handle_remark` varchar(512) DEFAULT NULL COMMENT '后台处理备注',
  `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_reporter_id` (`reporter_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='举报投诉表';

-- --------------------------------------------------------------------------------
-- 9. 轮播图表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(64) DEFAULT NULL COMMENT '标题',
  `image_url` varchar(512) NOT NULL COMMENT '图片 URL',
  `link_url` varchar(512) DEFAULT NULL COMMENT '点击跳转链接',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='首页轮播图表';

-- --------------------------------------------------------------------------------
-- 10. 管理后台角色表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `role_name` varchar(64) NOT NULL COMMENT '角色名称',
  `role_code` varchar(64) NOT NULL COMMENT '角色编码',
  `description` varchar(256) DEFAULT NULL COMMENT '描述',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理后台角色表';

-- --------------------------------------------------------------------------------
-- 11. 管理后台用户表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(64) NOT NULL COMMENT '登录用户名',
  `password` varchar(128) NOT NULL COMMENT '密码（BCrypt 加密存储）',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(512) DEFAULT NULL COMMENT '头像 URL',
  `role_id` bigint DEFAULT NULL COMMENT '角色 ID',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理后台用户表';

-- --------------------------------------------------------------------------------
-- 12. 操作日志表
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `operate_log`;
CREATE TABLE `operate_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `admin_id` bigint DEFAULT NULL COMMENT '操作人管理员 ID',
  `username` varchar(64) DEFAULT NULL COMMENT '操作人用户名',
  `module` varchar(64) DEFAULT NULL COMMENT '模块（如投票管理、用户管理）',
  `action` varchar(128) DEFAULT NULL COMMENT '操作描述',
  `request_method` varchar(16) DEFAULT NULL COMMENT '请求方法',
  `request_url` varchar(512) DEFAULT NULL COMMENT '请求 URL',
  `request_param` text COMMENT '请求参数（可选，敏感信息需脱敏）',
  `ip` varchar(64) DEFAULT NULL COMMENT '操作 IP',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理后台操作日志表';

-- --------------------------------------------------------------------------------
-- 13. 系统设置表（平台通用参数，键值对）
-- --------------------------------------------------------------------------------
DROP TABLE IF EXISTS `system_setting`;
CREATE TABLE `system_setting` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `setting_key` varchar(64) NOT NULL COMMENT '配置键',
  `setting_value` text COMMENT '配置值',
  `description` varchar(256) DEFAULT NULL COMMENT '说明',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- --------------------------------------------------------------------------------
-- 初始数据：管理后台用户 用户名 admin / 密码 admin（密码需为 BCrypt 加密存储）
-- 请先执行下面 INSERT，再在 Spring 应用中运行一次生成 admin 的 BCrypt 并更新库：
--   String hash = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("admin");
--   UPDATE admin_user SET password = '<生成的 hash>' WHERE username = 'admin';
-- 或：建表后通过“修改密码”功能将 admin 的密码改为 admin。
-- --------------------------------------------------------------------------------
INSERT INTO `admin_user` (`username`, `password`, `nickname`, `status`)
VALUES ('admin', '$2a$10$8K1p/a0dL2LXKZv5Z5Z5ZeOXZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', '管理员', 1);
-- 说明：上列 password 为 60 字符占位 BCrypt 格式。正式使用时请用 BCryptPasswordEncoder.encode("admin") 生成后 UPDATE 本表。

-- 若需先插入角色再关联，可先插入默认角色，再更新 admin 的 role_id（此处省略，可按需添加）

SET FOREIGN_KEY_CHECKS = 1;
