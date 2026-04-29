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



# 在线投票评选系统 - 微信小程序

微信小程序原生项目，与后端 API（http://localhost:8081）交互。

## 确保后端服务已启动

**vote-backend** 需先运行在 **http://localhost:8081**，小程序才能正常请求接口。

在项目根目录的 `vote-backend` 下执行：

```bash
cd vote-backend
.\run.ps1
```

或使用 Maven：`mvn spring-boot:run`。启动成功后访问 http://localhost:8081/ 或 http://localhost:8081/health 可验证。

## 目录结构

- `app.js` / `app.json` / `app.wxss`：入口与全局配置
- `pages/`：首页、投票列表、详情、结果、创建、参与、分享、我的
- `components/`：轮播图、分类栏、投票卡片、评论项、创建投票弹窗
- `utils/`：request（统一请求与 baseURL）、auth、util
- `api/`：banner、category、vote、comment、report、user
- `config/env.js`：后端地址前缀 `http://localhost:8081`
- `images/`：导航/菜单等已使用 SVG 图标（见 `images/README.md`）；底部 tabBar 需 81×81 的 PNG，若占位不显示请替换

## 启动方式

1. **先启动后端**：在 `vote-backend` 目录执行 `.\run.ps1`，确保服务运行在 http://localhost:8081
2. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
3. 打开微信开发者工具 → 导入项目 → 选择本目录 `vote-miniprogram`
4. 在「详情」→「本地设置」中勾选 **不校验合法域名**（便于本地调试 localhost）
5. 编译运行即可

## 首页布局说明

参考 UI 示意图：顶部导航（返回、首页、更多、添加）、轮播图、分类列表、创建投票按钮、参与投票按钮。

## 后端地址

默认使用 `config/env.js` 中的 `baseURL`（`http://localhost:8081`）。

真机调试时（手机访问电脑后端），可在开发者工具 Console 执行：

```js
wx.setStorageSync('dev_base_url', 'http://你的电脑局域网IP:8081')
```

查看当前实际请求地址：

```js
wx.getStorageSync('dev_base_url')
```

恢复默认地址：

```js
wx.removeStorageSync('dev_base_url')
```
