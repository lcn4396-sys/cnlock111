# 在线投票评选系统 - 后端 API 服务

提供小程序接口 `/api/mini` 与管理端接口 `/api/admin`，技术栈：Spring Boot、Spring Data JPA、MySQL、JWT、Spring Security、CORS、Swagger/OpenAPI。

## 环境要求

- JDK 11+
- Maven 3.6+（或使用项目内 run 脚本）
- MySQL 8（已执行 `hall_schema.sql` 建库建表）

## 配置

修改 `src/main/resources/application.yml` 中的数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/hall?...
    username: root
    password: 你的密码
```

## 启动方式

### 方式一：Maven 命令

```bash
cd vote-backend
mvn spring-boot:run
```

### 方式二：PowerShell 脚本（无全局 Maven 时）

```powershell
cd vote-backend
.\run.ps1
```

启动后默认端口 **8081**。

### 启动失败排查

| 报错 | 处理办法 |
|------|----------|
| **Port 8081 was already in use** | 8081 已被占用。任选其一：① 关闭已运行的 vote-backend 或其它占用 8081 的程序；② 改用 8082 端口：`.\run.ps1 --server.port=8082`（访问时用 http://localhost:8082） |
| **Access denied for user 'root'@'localhost'** | MySQL 账号或密码错误。修改 `src/main/resources/application.yml` 里 `spring.datasource.username`、`spring.datasource.password` 为本地 MySQL 实际账号密码，并确保已建库 `hall` 且执行过 `hall_schema.sql` |

## 接口文档

- Swagger UI: http://localhost:8081/swagger-ui.html  
- OpenAPI JSON: http://localhost:8081/v3/api-docs  

## 接口前缀

- 小程序: `/api/mini`（部分接口需请求头 `Authorization: Bearer <JWT>`）
- 管理端: `/api/admin`（当前为 permitAll，可按需接入 Session/JWT 鉴权）
