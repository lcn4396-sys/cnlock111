# 投票管理后台（后台管理系统）

基于 Spring Boot + Thymeleaf + Bootstrap 的投票后台管理，前后端一体。

## 技术栈

- **后端**: Spring Boot 2.7、Spring MVC、Spring Security、Spring Data JPA（兼容 **JDK 11**）
- **前端**: Thymeleaf、HTML5、CSS3、JavaScript、Bootstrap 5
- **数据库**: MySQL（库名 `hall`，需先执行 `hall_schema.sql`）

## 启动方式

1. 确保已安装 **JDK 11 或 17**（当前项目按 JDK 11 编译）；MySQL 已创建数据库 `hall` 并执行建表脚本（可选，不连库时需在 `application.yml` 中注释数据源或改用 H2）。
2. **无需安装 Maven** 时，在项目根目录（本 `resources` 目录）用 PowerShell 执行：
   ```powershell
   .\run.ps1
   ```
   首次运行会自动下载 Maven Wrapper 所需文件，再启动应用。若提示“无法加载脚本”，请先执行：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`。
3. 若本机已安装 Maven 且 `mvn` 在 PATH 中，也可执行：
   ```bash
   mvn spring-boot:run
   ```
   或先执行一次 `mvn -N wrapper:wrapper` 生成完整 Maven Wrapper，之后用：
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
4. 浏览器访问：http://localhost:8080  
   未登录会跳转登录页，默认账号 **admin**，密码 **admin**。

## 目录说明

- `src/main/java`：启动类、Security 配置、页面控制器。
- `src/main/resources/templates`：Thymeleaf 页面（登录、投票/分类/用户/评论/举报/系统/日志）。
- `src/main/resources/static`：静态资源（CSS、JS）。

业务数据需对接 `/api/admin/*` 接口（可在本工程或同一 Spring Boot 应用中实现）。
